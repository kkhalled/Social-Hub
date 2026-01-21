import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SocialBtns() {
  return (
    <div className="flex  justify-between px-8 gap-3 mx-auto mt-2">
      <button className="flex items-center justify-center gap-2 px-6 grow rounded-lg border-2 border-gray-100 hover:bg-gray-50/70 transition">
        <FontAwesomeIcon icon={faGoogle} className="text-red-500" />
        <span>Google</span>
      </button>

      <button className="flex items-center justify-center gap-2 py-2.5 px-6 grow rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
        <FontAwesomeIcon icon={faFacebook} />
        <span>Facebook</span>
      </button>
    </div>
  );
}
