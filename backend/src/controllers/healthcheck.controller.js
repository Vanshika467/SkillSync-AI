import { ApiResponse } from "../utils/ApiResponse.js";

const healthcheck = (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "SkillSync AI Backend is Running 🚀"
    )
  );
};
  export { healthcheck };// multiple functions ayenge idhar isiliye default not used routes m
  //mein ek hi route export nkiya gya hain isilye default used