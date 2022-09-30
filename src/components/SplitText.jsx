export const SplitText = ({ text }) => {
  return (
    <>
      {text.split('').map((char, index) =>
        char === ' ' ? (
          <span
            key={index}
            style={{ width: '0.28em', display: 'inline-block' }}
          ></span>
        ) : (
          <span
            key={index}
            style={{ '--index': index, display: 'inline-block' }}
          >
            {char}
          </span>
        )
      )}
    </>
  );
};
