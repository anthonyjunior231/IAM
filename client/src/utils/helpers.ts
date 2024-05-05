import { formatDistanceToNow } from "date-fns";
import moment from "moment";

export const customStyles = {
  control: (provided: any) => ({
    ...provided,
    border: "1px solid #ececec",

    minHeight: "2.5rem",
    minWidth: "6rem",
    borderRadius: "8px",
    fontSize: "0.85rem",
    color: "black",
    boxShadow: "none", // Remove box shadow
    "&:focus": {
      outline: "none", // Remove outline on focus
    },
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    display: "none", // Remove the vertical line between indicator and text
  }),
  option: (provided: any) => ({
    ...provided,
    fontSize: "0.85rem", // Set font size of dropdown options
  }),
};
export const customUploadStyles = {
  control: (provided: any) => ({
    ...provided,
    border: "1px solid #ececec",

    minHeight: "2.5rem",
    width: "15rem",
    minWidth: "100%",
    borderRadius: "8px",
    fontSize: "0.85rem",
    color: "black",
    boxShadow: "none", // Remove box shadow
    "&:focus": {
      outline: "none", // Remove outline on focus
    },
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    display: "none", // Remove the vertical line between indicator and text
  }),
  option: (provided: any) => ({
    ...provided,
    fontSize: "0.85rem", // Set font size of dropdown options
  }),
};

export const customStylesPermissions = {
  control: (provided: any) => ({
    ...provided,
    border: "1px solid #ececec",

    minWidth: "6rem",
    minHeight: "2.5rem",
    borderRadius: "8px",
    fontSize: "0.85rem",
    color: "black",
    boxShadow: "none", // Remove box shadow
    "&:focus": {
      outline: "none", // Remove outline on focus
    },
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    display: "none", // Remove the vertical line between indicator and text
  }),
  option: (provided: any) => ({
    ...provided,
    fontSize: "0.85rem", // Set font size of dropdown options
  }),
};

export const calculateFileSize = (file: File) => {
  const fileSizeInBytes = file.size;
  // Convert bytes to KB
  const fileSizeInKB = fileSizeInBytes / 1024;
  if (fileSizeInKB < 1024) {
    return fileSizeInKB.toFixed(2) + " KB";
  } else {
    // Convert KB to MB
    const fileSizeInMB = fileSizeInKB / 1024;
    return fileSizeInMB.toFixed(2) + " MB";
  }
};

export const formatDate = (dateString: string) => {
  return moment(dateString).format("MMMM Do YYYY, h:mm:ss a");
};
export function countNonNullValues(arr: any[]) {
  // Filter out null values from the array
  const nonNullArray = arr.filter((value) => value !== null);

  // Return the length of the filtered array
  return nonNullArray.length;
}

export const calculateTotalFileSize = (files: any[]) => {
  let totalSize = 0;

  // Loop through each file in the files array
  files.forEach((file) => {
    // Extract the file size from the file object
    const fileSizeStr = file?.file_size;

    // Remove " KB" from the file size string and convert it to a number
    const fileSizeNum = parseFloat(fileSizeStr?.replace(" KB", ""));

    // Add the file size to the total size
    totalSize += fileSizeNum;
  });

  // Convert total size to appropriate unit (KB, MB, GB)
  let sizeUnit = "KB";
  let size = totalSize;
  if (totalSize >= 1024) {
    size /= 1024;
    sizeUnit = "MB";
    if (totalSize >= 1024 * 1024) {
      size /= 1024;
      sizeUnit = "GB";
    }
  }

  // Round the size to two decimal places
  const stringSize : any = size.toFixed(2);

  // Return the total size with the appropriate unit
  return `${stringSize}${sizeUnit}`;
};

export const reviseRole = (role: string) => {
  if (role === "super_admin") {
    return "Administrator";
  } else if (role === "manager") {
    return "Manager";
  } else if (role === "admin") {
    return "Admin";
  } else if (role === "cyber_security_analyst") {
    return "CyberSecurity Analyst";
  } else if (role === "customer_service") {
    return "Customer Service";
  } else if (role === "chief_finance_officer") {
    return "Chief Finance Officer";
  } else if (role === "business_administrator") {
    return "Business Administrator";
  } else {
    return "Employee";
  }
};

// export function calculateTimePassed(timeString: string) {
//   // Parse the time string using Moment.js
//   const startTime = moment(timeString, "YYYY-MM-DD HH:mm:ss");

//   // Get the current time
//   const currentTime = moment();

//   // Calculate the difference
//   const difference = moment.duration(currentTime.diff(startTime));

//   // Format the duration
//   const formattedTimePassed = moment.duration(difference).humanize();

//   return formattedTimePassed;
// }

export const calculateTimePassed = (dateString: string) => {
  const date = new Date(dateString);
  return formatDistanceToNow(date);
};

export const openInBrowser = (url: any, filename: any) => {
  // Create a new anchor element dynamically
  const anchor = document.createElement("a");
  anchor.href = url;

  // Set target as '_blank' to open in a new tab
  anchor.target = "_blank";

  // Optionally, use download attribute if filename is provided
  // This part is usually not needed if you just want to open the file
  if (filename) {
    anchor.download = filename;
  }

  // Append the anchor to the body, click it, and then remove it
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};

export const downloadFileFromUrl = async (url: string, filename: string) => {
  try {
    // Fetch the file from the provided URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    // Convert the response data to a Blob
    const blob = await response.blob();

    // Create a temporary anchor element and trigger download
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";

    // Create a URL for the Blob and set up the anchor attributes
    const blobUrl = window.URL.createObjectURL(blob);
    a.href = blobUrl;
    a.download = filename; // Set the filename for the download
    a.click();

    // Clean up by revoking the Blob URL and removing the anchor element
    window.URL.revokeObjectURL(blobUrl);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading the file:", error);
  }
};

//add logign login user to backend
//add making access requests
//uplaoded by folder
//reove help and support
//remove user image

//undefined manage access rename file

//set for backend managers can create fodlers and files
