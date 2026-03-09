import { useParams } from "react-router-dom";
import BentoGrid from "../components/BentoGrid";

const CategoryRecipes = ({ recipes }) => {
  const { type } = useParams();

  const filtered = recipes.filter(
    (r) => r.category === type
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{type}</h1>
      <BentoGrid recipes={filtered} />
    </div>
  );
};

export default CategoryRecipes;
