export default function Divider() {
  return (
    <div
      className="
       mt-4
        relative flex items-center justify-center 
        text-sm 
        before:w-1/4 before:h-px before:bg-gray-400/30 before:mr-4 before:absolute before:start-5
        after:w-1/4 after:h-px after:bg-gray-400/30 after:ml-4 after:absolute after:end-5
      "
    >
      or continue with email
    </div>
  );
}
