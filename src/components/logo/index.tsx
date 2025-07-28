import { Link } from "react-router-dom";
import logoImage from "../../assets/logo.png";


interface LogoProps {
  url?: string;
  linkWrapper?: boolean;
}

const Logo = ({ url = "/", linkWrapper = true }: LogoProps) => {
  const logoContent = (
    <div className="flex h-8 w-8 items-center justify-center rounded-md">
      <img
        src={logoImage}
        alt="ConnectCircle Logo"
        className="h-full w-full object-contain"
      />
    </div>
  );

  return (
    <div className="flex items-center justify-center sm:justify-start">
      {linkWrapper ? (
        <Link to={url}>{logoContent}</Link>
      ) : (
        logoContent
      )}
    </div>
  );
};

export default Logo;
