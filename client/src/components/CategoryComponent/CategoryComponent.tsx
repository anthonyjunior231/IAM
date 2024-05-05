import { CategoryData } from "../../utils/types";
import "./categoryComponent.css";

const CategoryComponent = ({ created_at, description, name }: CategoryData) => {
  return (
    <div className="category-component">
      <span>{name}</span>
      <span>{description}</span>
      <span>{created_at}</span>
      <span className="category-component-clickable">view category</span>
    </div>
  );
};

export default CategoryComponent;
