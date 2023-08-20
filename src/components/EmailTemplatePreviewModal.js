import React from "react";
import { Link } from "react-router";

import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const PreviewModal = (props) => {
  let mode, title, text;
  if (props.previewedTemplate.message) {
    mode = `message`;
    title = props.previewedTemplate.subject;
    text = props.previewedTemplate.message;
  } else {
    mode = `template`;
    title = props.previewedTemplate.title;
    text = props.previewedTemplate.standardText;
  }

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={props.previewedTemplate ? true : false}
      onClose={props.onClose}
    >
      <div
        style={{
          position: `absolute`,
          backgroundColor: `white`,
          top: `50%`,
          left: `50%`,
          width: `80%`,
          height: `80%`,
          padding: `10px`,
          transform: `translate(-50%, -50%)`,
        }}
      >
        <Typography variant="h6" id="modal-title">
          {title}
        </Typography>
        <div
          style={{
            overflow: `scroll`,
            height: `calc(100% - 80px)`,
            fontSize: `10pt`,
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: text }} />
        </div>
        <div style={{ paddingTop: `10px`, textAlign: `right` }}>
          {mode === `template` ? (
            <Link
              to={`/emails/templates/edit/${props.previewedTemplate.templateID}`}
              className="no-underline"
              style={{ marginRight: `10px` }}
            >
              <Button size="small" variant="contained" color="primary">
                Edit template
              </Button>
            </Link>
          ) : (
            false
          )}
          <Button size="small" variant="contained" onClick={props.onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PreviewModal;
