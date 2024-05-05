// import { useEffect, useState } from "react";
// import CategoryComponent from "../../components/CategoryComponent/CategoryComponent";
// import "./categoryDashboard.css";

// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../../redux/store";
// import { GetCategories } from "../../redux/slices/categorySlice";
// import { CategoryData } from "../../utils/types";

// const CategoryDashboard = () => {
//   const [loadingState, setLoadingState] = useState<boolean>(true);

//   //get fetched categories from state
//   const categories: CategoryData[] = useSelector(
//     (state: RootState) => state.category.fetchedCategories
//   );

//   const dispatch = useDispatch<AppDispatch>();

//   const fetchingCategories = async () => {
//     const result = await dispatch(GetCategories());

//     if (result) {
//       setLoadingState(false);
//     } else {
//       setLoadingState(false);
//     }
//   };

//   useEffect(() => {
//     fetchingCategories();
//   }, []);

//   useEffect(() => {
//     console.log(loadingState);
//   }, [loadingState]);

//   return (
//     <div className="category-dashboard">
//       {loadingState ? (
//         <>Loading . . . . </>
//       ) : (
//         <>
//           <div className="category-dashboard-top">
//             <div className="category-dashboard-top-left">
//               <Link to="/categories/create" className="add-category-button">
//                 Add Category
//               </Link>
//             </div>
//             <div className="category-dashboard-top-right"></div>
//           </div>

//           <div className="category-dashboard-bottom">
//             <span className="category-dashboard-title">List of categories</span>

//             <div className="category-table-header">
//               <span className="category-name">Name</span>
//               <span className="category-name">Description</span>
//               <span className="category-name">Created At</span>
//               <span></span>
//             </div>

//             <div className="category-table-content">
//               {categories.map((data: CategoryData, index: number) => (
//                 <CategoryComponent key={index} {...data} />
//               ))}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default CategoryDashboard;
