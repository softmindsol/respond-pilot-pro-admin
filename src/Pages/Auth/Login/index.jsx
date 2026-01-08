import LoginCarousel from "../../../components/AuthComponents/LoginComponents/loginCarousel";
import LoginForm from "../../../components/AuthComponents/LoginComponents/loginForm";

const Login = () => {
  return (
    <section className="py-20 lg:py-0">
      <div className="flex lg:flex-row flex-col-reverse items-center justify-center h-screen lg:gap-[60px]">
        <LoginCarousel />
        <LoginForm />
      </div>
    </section>
  );
};

export default Login;
