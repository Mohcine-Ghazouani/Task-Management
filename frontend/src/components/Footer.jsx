export default function Footer() {
  return (
    <div className="container flex flex-col items-center justify-between mx-auto md:flex-row">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Membre Dashboard. All Rights Reserved.
      </p>
      <ul className="flex mt-2 space-x-4 md:mt-0">
        <li>
          <a
            href="/privacy-policy"
            className="text-gray-300 transition duration-300 hover:text-white"
          >
            Privacy Policy
          </a>
        </li>
        <li>
          <a
            href="/terms-of-service"
            className="text-gray-300 transition duration-300 hover:text-white"
          >
            Terms of Service
          </a>
        </li>
        <li>
          <a
            href="/contact"
            className="text-gray-300 transition duration-300 hover:text-white"
          >
            Contact Us
          </a>
        </li>
      </ul>
    </div>
  );
}
