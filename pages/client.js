import HeadInject from "../components/shared/HeadInject";
import Container from "../components/client/Container";

export default function client() {
  return (
    <HeadInject>
      <div className="min-h-screen p-3 bg-gradient-to-b from-green-400 to-white">
        <Container />
      </div>
    </HeadInject>
  );
}
