import HeadInject from "../components/shared/HeadInject";
import SigninCard from "../components/home/SigninCard";

export default function Home() {
  return (
    <HeadInject>
      <div className="grid place-content-center h-screen bg backgroundd">
        <SigninCard />
      </div>
    </HeadInject>
  );
}
