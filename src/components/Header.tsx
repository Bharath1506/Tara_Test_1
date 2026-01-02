import TaraLogo from "./TaraLogo";

const Header = () => {
  return (
    <header className="w-full py-4 px-6">
      <div className="flex items-center gap-3">
        <TaraLogo size="xs" />
        <span className="text-xl font-semibold text-olive">TalentSpotify</span>
      </div>
    </header>
  );
};

export default Header;
