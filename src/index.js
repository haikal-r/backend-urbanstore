const express = require("express");
const dotenv = require("dotenv");
const { routes } = require("./routes");
const { StatusCodes: status } = require("http-status-codes");
const { apiResponse } = require("./utils/apiResponse.utils");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const FormData = require('form-data');

dotenv.config();
const app = express();

const upload = multer();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Custom-Header"],
    credentials: true,
  })
);
app.use(cookieParser());

// app.post("/testUpload", upload.single("image"), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   try {
//     const formData = new FormData();
//     formData.append("image", req.file.buffer, req.file.originalname);

//     const response = await axios.post(
//       "https://api.imgbb.com/1/upload",
//       formData,
//       {
//         params: {
//           key: "32121eac2d5fc26e6b4fc66c9b38eff6", 
//         },
//         headers: formData.getHeaders(),
//       }
//     );

//     res.json({ url: response.data.data.url });
//   } catch (error) {
//     console.error("Error uploading to ImgBB:", error);
//     res.status(500).json({ error: "Failed to upload image" });
//   }
// });

app.post("/testUpload", upload.array('images'), async (req, res) => {
  console.log('line 55 =>', req.files)

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  try {
    const uploadedUrls = [];
    
    for (const file of req.files) {
      console.log("line 66 =>", file.originalname);
      console.log("line 67 =>", file.buffer);
      const formData = new FormData();
      formData.append("image", file.buffer, file.originalname);

      const response = await axios.post(
        "https://api.imgbb.com/1/upload",
        formData,
        {
          params: {
            key: "32121eac2d5fc26e6b4fc66c9b38eff6", 
          },
          headers: formData.getHeaders(),
        }
      );

      console.log(response)

      uploadedUrls.push(response.data.data.url);
    }

    res.json({ urls: uploadedUrls });
  } catch (error) {
    console.error("Error uploading to ImgBB:", error);
    res.status(500).json({ error: "Failed to upload images" });
  }
});

app.get("/", (req, res) => {
  res.status(status.OK).json(
    apiResponse({
      code: status.OK,
      status: "OK",
      message: "Welcome to the initial Express API Structure",
    })
  );
});

app.get((req, res) => {
  res.status(status.NOT_FOUND).json(
    apiResponse({
      code: status.NOT_FOUND,
      status: "NOT_FOUND",
      message: "The requested resource could not be found.",
    })
  );
});

app.get((err, req, res, next) => {
  res.status(status.INTERNAL_SERVER_ERROR).json(
    apiResponse({
      code: status.INTERNAL_SERVER_ERROR,
      status: "INTERNAL_SERVER_ERROR",
      message: err.message,
    })
  );
});

// Routes
routes(app);

// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.info(`Server is running on port ${PORT}, ${process.env.BASE_URL}`);
});
