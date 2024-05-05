// import InputField from "../../components/inputField/inputField.tsx";
// import "./createCategory.css";
// import { ChangeEvent, useState } from "react";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "../../redux/store";
// import { CreateCategory } from "../../redux/slices/categorySlice";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css"; // Import CSS for styling

// interface FormData {
//   description: string;
//   name: string;
// }

// const initialFormData: FormData = {
//   description: "", // Initial values can be empty strings or whatever default values you prefer
//   name: "",
// };
// const CreateCategoryPage = () => {
//   const [formData, setFormData] = useState<FormData>(initialFormData);
//   const [loadingState, setLoadingState] = useState<boolean>(false);

//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ): void => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   //declaring dispatch
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   const handleSubmit = async () => {
//     setLoadingState(true);
//     const result = await dispatch(CreateCategory(formData));

//     if (result.type === "category/create-category/fulfilled") {
//       navigate("/categories");
//       toast.success("Category created successfully", {
//         position: "top-right", // Adjust position if needed
//       });
//       setLoadingState(false);
//     } else {
//       toast.error("Something went wrong", {
//         position: "top-right", // Adjust position if needed
//       });
//       setLoadingState(false);
//     }
//   };

//   return (
//     <div className="create-category-container">
//       <div className="create-category">
//         <span className="create-category-text">Create category</span>
//         <InputField
//           type="text"
//           name="name"
//           label="Name"
//           placeholder="Name"
//           value={formData.name}
//           onChange={handleChange}
//         />
//         <InputField
//           type="text"
//           name="description"
//           placeholder="Description"
//           label="Description"
//           value={formData.description}
//           onChange={handleChange}
//         />

//         <button
//           onClick={handleSubmit}
//           disabled={loadingState}
//           className="create-category-button"
//         >
//           {loadingState ? "Loading . . . " : "Create category"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CreateCategoryPage;
