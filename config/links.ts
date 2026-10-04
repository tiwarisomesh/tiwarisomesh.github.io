import { FaEnvelope, FaFilePdf, FaGithub, FaLinkedin } from "react-icons/fa";

export const email = "ms25003@iisermohali.ac.in";

export const contact = { label: "Email", href: `mailto:${email}`, Icon: FaEnvelope };
export const cv = { label: "CV", href: "/cv.pdf", Icon: FaFilePdf };
export const profiles = [
  { label: "GitHub", href: "https://github.com/tiwarisomesh", Icon: FaGithub },
  { label: "LinkedIn", href: "https://linkedin.com/in/tiwari-somesh", Icon: FaLinkedin },
];