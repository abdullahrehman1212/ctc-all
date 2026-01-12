/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */

import { Box, Modal, Slider, Button } from "@mui/material";
import { useRef, useState, useEffect } from "react";
import AvatarEditor from "react-avatar-editor";
import { FcAddImage } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import "./Cropper.scss";
import showNotification from '../../../components/extras/showNotification';
import { _titleWarning } from '../../../baseURL/messages';

// Styles
const boxStyle = {
  width: "300px",
  height: "300px",
  display: "flex",
  flexFlow: "column",
  justifyContent: "center",
  alignItems: "center",
};

const modalStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const circularContainerStyle = {
  width: "100%",
  height: "100%",
  position: "relative",
};

// Modal Component
const CropperModal = ({ src, modalOpen, setModalOpen, setPreview, setCompanyLogo, setShowCropper }) => {
  const [slideValue, setSlideValue] = useState(10);
  const cropRef = useRef(null);

  const handleCancel = () => {
    setModalOpen(false);
    setShowCropper(false);
  };

  const handleSave = async () => {
    if (cropRef.current) {
      const dataUrl = cropRef.current.getImage().toDataURL();

      // Create an image element to load the data URL
      const img = new Image();
      img.src = dataUrl;

      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const size = Math.min(img.width, img.height);
        canvas.width = size;
        canvas.height = size;

        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, (size - img.width) / 2, (size - img.height) / 2);
        const circularDataUrl = canvas.toDataURL();

        const result = await fetch(circularDataUrl);
        const blob = await result.blob();
        setPreview(URL.createObjectURL(blob));
        setCompanyLogo(blob);
        setModalOpen(false);
        setShowCropper(false);
      };
    }
  };

  return (
    <Modal sx={modalStyle} open={modalOpen}>
      <Box sx={boxStyle}>
        <div style={circularContainerStyle}>
          <AvatarEditor
            ref={cropRef}
            image={src}
            style={{ width: "100%", height: "100%" }}
            border={30}
            borderRadius={100}
            color={[0, 0, 0, 0.70]}
            scale={slideValue / 12}
            rotate={0}
          />
        </div>
        <Slider
          min={10}
          max={50}
          sx={{ margin: "0 auto", width: "80%", color: "cyan" }}
          size="medium"
          defaultValue={slideValue}
          value={slideValue}
          onChange={(e) => setSlideValue(e.target.value)}
        />
        <Box sx={{ display: "flex", padding: "10px", border: "3px solid white", background: "black" }}>
          <Button
            size="small"
            sx={{ marginRight: "10px", color: "white", borderColor: "white" }}
            variant="outlined"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button sx={{ background: "#5596e6" }} size="small" variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

// Container Component
const Cropper = ({ setCompanyLogo, imageUpload, setShowCropper, showCropper }) => {
  const [src, setSrc] = useState(null);
  const [preview, setPreview] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (imageUpload && inputRef.current) {
      inputRef.current.click();
    }
  }, [imageUpload]);

  const handleInputClick = (e) => {
    e.preventDefault();
    inputRef.current.click();
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1048576) {
        showNotification(_titleWarning, 'Please upload a picture less than 1MB', 'Warning');
        e.target.value = null; 
      } else {
        setSrc(URL.createObjectURL(file));
        setModalOpen(true);
      }
    } else {
      setShowCropper(false);
    }
  };

  useEffect(() => {
    inputRef.current?.addEventListener('cancel', () => {
      setShowCropper(false);
    });
  }, [showCropper, setShowCropper]);

  return (
    <main className="container">
      <CropperModal
        modalOpen={modalOpen}
        src={src}
        setPreview={setPreview}
        setCompanyLogo={setCompanyLogo}
        setModalOpen={setModalOpen}
        setShowCropper={setShowCropper}
      />
      {!imageUpload && (
        <>
          <a href="/" onClick={handleInputClick}>
            <FcAddImage className="add-icon" />
          </a>
          <small>Click to select logo (optional)</small>
        </>
      )}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImgChange}
        style={{ display: 'none' }}
      />
      {preview && (
        <div className="img-container">
          <img
            src={preview || "https://www.signivis.com/img/custom/avatars/member-avatar-01.png"}
            alt="Preview"
            width="200"
            height="200"
            style={{ borderRadius: '50%' }}
          />
        </div>
      )}
    </main>
  );
};

export default Cropper;
