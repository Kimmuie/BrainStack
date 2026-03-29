const StyledHeader = ({ title, className = "" }) => {
  return (
    <h1 className={` bg-Secondary text-White px-4 md:px-7 py-2 md:py-4 rounded-bl-4xl rounded-tr-4xl text-xl md:text-3xl border-4 border-White shadow-[6px_6px_0_0_theme(colors.Darker-White)]
      ${className}
    `}>
      {title}
    </h1>
  );
};

export default StyledHeader;

