const bodyparser = require('body-parser');
const express = require('express');
const cors = require('cors');
const {MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const crypto = require('crypto');
require('dotenv').config({ path: '../.env' });

const app = express();

const API_KEY = process.env.API_KEY
const MONGO_URL = process.env.MONGODB_URL

app.use(cors({
    origin: '*',
    method: ['GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const uri = MONGO_URL;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const db = client.db('Brainstack');

const initDB = async () => {
    try{
        const collection = await db.listCollections().toArray();
        if (!collection.some(col => col.name === 'users')) {
            await db.createCollection('users', {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ['email', 'username'],
                        properties: {
                            email:    { bsonType: "string" },
                            username: { bsonType: "string" },
                            theme:    { bsonType: "string" },
                            group: {
                                bsonType: "array",
                                items: { bsonType: "string" }  // ["131452", "722652"]
                            },
                            tag: {
                                bsonType: "array",
                                items: {
                                    bsonType: "object",
                                    properties: {
                                        tagName:  { bsonType: "string" },
                                        tagGroup: { bsonType: "array", items: { bsonType: "string" } }
                                    }
                                }
                            }
                        }
                    }
                }
            });
        await db.collection('users').createIndex({ email: 1 }, { unique: true });
        console.log("Collection 'users' created");
        }   
        if (!collection.some(col => col.name === 'groups')) {
        await db.createCollection('groups', {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ['groupCode', 'groupName'],
                    properties: {
                        groupCode: { bsonType: "string" },
                        groupName: { bsonType: "string" },
                        groupData: {
                            bsonType: "object",
                            properties: {
                                groupUsers: {
                                    bsonType: "array",
                                    items: { bsonType: "string" }  // ["ex1@ex.com", "ex2@ex.com"]
                                }
                            }
                        },
                        groupCase: {
                            bsonType: "object",
                            properties: {
                                caseName: { bsonType: "string" },
                                caseIdeas: {
                                    bsonType: "array",
                                    items: {
                                        bsonType: "object",
                                        properties: {
                                            ideaDescription: { bsonType: "string" },
                                            ideaCreateBy:    { bsonType: "string" },
                                            ideaUpvote:      { bsonType: "int" },
                                            ideaDownvote:    { bsonType: "int" },
                                            ideaComment: {
                                                bsonType: "array",
                                                items: {
                                                    bsonType: "object",
                                                    properties: {
                                                        commentData: { bsonType: "string" },
                                                        commentUser: { bsonType: "string" }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        await db.collection('groups').createIndex({ groupCode: 1 }, { unique: true });
        console.log("Collection 'groups' created");
    }
    } catch (err) {
        console.error("Error initializing database:", err);
    }
};



//Route for Users
app.post('/Brainstack/users', async (req, res) => {
    const { email, username, theme } = req.body;

    try {
        await db.collection('users').insertOne({
            email: email,
            username: username,
            theme: theme
        });
        res.json({ succees: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get('/Brainstack/users/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const user = await db.collection('users').findOne({ email });
        if(!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post('/Brainstack/users/:email/tag', async (req, res) => {
    const { email } = req.params;
    const { tagName, tagGroup } = req.body;

    try {
        await db.collection('users').updateOne(
            { email },
            { $addToSet: { tag: { tagName, tagGroup: tagGroup || [] } } }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.delete('/Brainstack/users/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const result = await db.collection('users').deleteOne({ email });
        if(result.deletedCount === 0) {
            return res.status(404).json({ error: 'User not found'});
        }
        res.json({ message: `${email} delete successfully` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/Brainstack_test/users/:email', async (req, res) => {
    const { email } = req.params;
    const { email: _, group, tag, ...safeUpdates } = req.body; // กัน field ออก

    try {
        const result = await db.collection('users').findOneAndUpdate(
            { email },
            { $set: safeUpdates },
            { returnDocument: 'after' }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ success: true, user: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



//Route for Group
app.post('/Brainstack/groups', async (req, res) => {
    const { groupName, creatorEmail } = req.body;

    try {
        const groupCode = crypto.randomBytes(3).toString('hex');

        await db.collection('groups').insertOne(
            {
                groupCode,
                groupName,
                groupData: { groupUsers: [creatorEmail] },
                groupCase: { caseName: "", caseIdeas: [] }
            });
        
        await db.collection('users').updateOne(
            { email: creatorEmail },
            { $addToSet: { group: groupCode} }
        );
        res.json({ success: true, groupCode});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get('/Brainstack/groups/:groupCode', async (req, res) => {
    const { groupCode } = req.params;

    try {
        const group = await db.collection('groups').findOne({ groupCode });
        if(!group) return res.status(404).json({ error: 'Group not found' });
        res.json(group);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get('/Brainstack_test/users/:email/groups', async (req, res) => {
    const { email } = req.params;
    try {
        // 1. ดึง user เพื่อเอา groupCode array
        const user = await db.collection('users').findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        // 2. ดึง groups ทั้งหมดที่ groupCode อยู่ใน array ของ user
        const groups = await db.collection('groups')
            .find({ groupCode: { $in: user.group } })
            .toArray();

        res.json(groups);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post('/Brainstack/groups/:groupCode/join', async (req, res) => {
    const { groupCode } = req.params;
    const { email } = req.body;

    try {

        await db.collection('groups').updateOne(
            { groupCode },
            { $addToSet: { "groupData.groupUsers": email } }
        );
        await db.collection('users').updateOne(
            { email },
            { $addToSet: { group: groupCode } }
        );
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.delete('/Brainstack/groups/:groupCode', async (req, res) => {
    const { groupCode } = req.params;

    try {

        const groupResult = await db.collection('groups').deleteOne({ groupCode });
        if (groupResult.deletedCount === 0) {
            return res.status(404).json({ error: 'Group not found' });
        }

        await db.collection('users').updateMany(
            { group: groupCode },           
            { $pull: { group: groupCode } } 
        );

        res.json({ message: `Group ${groupCode} deleted successfully` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



//Route for Idea
app.post("/Brainstack/groups/:groupCode/caseIdea", async (req, res) => {
    const { groupCode } = req.params;
    const { ideaDescription, ideaCreateBy } = req.body;

    try {
        await db.collection('groups').updateOne(
            { groupCode },
            { $addToSet: { 'groupCase.caseIdeas': {
                ideaDescription,
                ideaCreateBy,
                ideaUpvote: 0,
                ideaDownvote: 0,
                ideaComment: []
            }}}            
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post("/Brainstack/groups/:groupCode/caseIdea/:index/downvote", async (req, res) => {
    const { groupCode, index } = req.params;

    try {
        await db.collection('groups').updateOne(
            { groupCode },
            { $inc: { [`groupCase.caseIdeas.${index}.ideaDownvote`]: 1}}
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post("/Brainstack/groups/:groupCode/caseIdea/:index/upvote", async (req, res) => {
    const { groupCode, index } = req.params;

    try {
        await db.collection('groups').updateOne(
            { groupCode },
            { $inc: { [`groupCase.caseIdeas.${index}.ideaUpvote`]: 1}}
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.delete('/Brainstack/groups/:groupCode/caseIdea/:index', async (req, res) => {
    const { groupCode, index } = req.params;
    try {
        const group = await db.collection('groups').findOne({ groupCode });
        if (!group) return res.status(404).json({ error: 'Group not found' });

        // เอา idea ออกจาก array ด้วย index
        group.groupCase.caseIdeas.splice(index, 1);

        await db.collection('groups').updateOne(
            { groupCode },
            { $set: { "groupCase.caseIdeas": group.groupCase.caseIdeas } }
        );

        res.json({ message: `Idea deleted successfully` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.delete('/Brainstack/groups/:groupCode/caseIdea/:index/upvote', async (req, res) => {
    const { groupCode, index } = req.params;
    try {
        await db.collection('groups').updateOne(
            { groupCode },
            { $inc: { [`groupCase.caseIdeas.${index}.ideaUpvote`]: -1 } }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.delete('/Brainstack/groups/:groupCode/caseIdea/:index/downvote', async (req, res) => {
    const { groupCode, index } = req.params;
    try {
        await db.collection('groups').updateOne(
            { groupCode },
            { $inc: { [`groupCase.caseIdeas.${index}.ideaDownvote`]: -1 } }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// Route for Comments
app.post("/Brainstack/api/groups/:groupCode/caseIdea/:index/comment", async (req, res) => {
    const { groupCode, index } = req.params;
    const { commentData, commentUser } = req.body;
    try {
        await db.collection('groups').updateOne(
            { groupCode },
            { $push: { [`groupCase.caseIdeas.${index}.ideaComment`]: {
                commentData,
                commentUser
            }}}
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get('/Brainstack/groups/:groupCode/caseIdea/:index/comment', async (req, res) => {
    const { groupCode, index } = req.params;
    try {
        const group = await db.collection('groups').findOne({ groupCode });
        if (!group) return res.status(404).json({ error: 'Group not found' });

        const comments = group.groupCase.caseIdeas[index].ideaComment;

        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.delete('/Brainstack/groups/:groupCode/caseIdea/:index/comment/:commentIndex', async (req, res) => {
    const { groupCode, index, commentIndex } = req.params;
    try {
        const group = await db.collection('groups').findOne({ groupCode });
        if (!group) return res.status(404).json({ error: 'Group not found' });

        // เอา comment ออกจาก array ด้วย commentIndex
        group.groupCase.caseIdeas[index].ideaComment.splice(commentIndex, 1);

        await db.collection('groups').updateOne(
            { groupCode },
            { $set: { "groupCase.caseIdeas": group.groupCase.caseIdeas } }
        );

        res.json({ message: `Comment deleted successfully` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});






// start api
const start = async () => {
    await client.connect();
    await initDB();
    app.listen(3000, () => console.log("Server running on port 3000"));
};

start();