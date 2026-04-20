import Card from "./ui/Card";
import Input from "./ui/Input";
import PrimaryButton from "./ui/PrimaryButton";

export default function LogFoodCard({
  foodName,
  setFoodName,
  onFindFood,
}: {
  foodName: string;
  setFoodName: React.Dispatch<React.SetStateAction<string>>;
  onFindFood: () => void;
}) {
  return (
    <Card
      title="Log Food"
      subtitle="Search your food database or enter macros manually."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
        <Input
          placeholder="Enter food name"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
        />
        <PrimaryButton onClick={onFindFood} className="w-full md:w-auto">
          Find Food
        </PrimaryButton>
      </div>
    </Card>
  );
}