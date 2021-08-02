import React, { useState, useEffect } from "react";
// material ui
import {
  Modal,
  Fade,
  Backdrop,
  Paper,
  TextField,
  Button,
} from "@material-ui/core";
import { AssignmentTurnedIn } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
// butter toast
import ButterToast, { Cinnamon } from "butter-toast";
// filebase
import FileBase from "react-file-base64";
// redux
import { connect } from "react-redux";
import { createPost, updatePost } from "../../actions/postActions";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "200",
    },
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  btn: {
    margin: theme.spacing(1),
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

// blank form
const initialValues = {
  body: "",
  image: "",
};

function PostForm(props) {
  const classes = useStyles();
  // grab currently logged-on user as the author of the post
  const user = JSON.parse(localStorage.getItem('profile'));

  //modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  // form values
  const [values, setValues] = useState(initialValues);
  // form input
  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };
  // reset form
  const resetForm = () => {
    setValues(initialValues);
    props.setPostID(0);
  };
  // form submisstion
  const handleSubmit = (e) => {
    e.preventDefault();
    const onSuccess = () => {
      ButterToast.raise({
        content: (
          <Cinnamon.Crisp
            title="Submitted!"
            scheme={Cinnamon.Crisp.SCHEME_GREEN}
            icon={<AssignmentTurnedIn />}
          />
        ),
      });
      resetForm();
      setOpen(false);
    };
    // this is where the author's name is inserted into the post
    // author's ID will be inserted server-side to prevent funny businness
    if (props.postID == 0) 
      props.createPost({...values, author: user?.result?.name}, onSuccess);
    else 
      props.updatePost(props.postID, {...values, author: user?.result?.name}, onSuccess);
  };

  // post ID for edits
  useEffect(() => {
    // populate form
    if (props.postID != 0) {
      setValues({
        ...props.posts.find((p) => p._id == props.postID),
        image: "",
      });
      setOpen(true);
    }
  }, [props.postID]);

  return (
    <div className={classes.centerElements}>
      <Button
        className={classes.btn}
        variant="contained"
        color="primary"
        type="button"
        onClick={handleOpen}
      >
        Create Post
      </Button>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Paper className={classes.paper}>
            <form
              className={classes.root}
              autoComplete="off"
              noValidate
              onSubmit={handleSubmit}
            >
              <TextField
                name="body"
                variant="outlined"
                label="Body"
                fullWidth
                multiline
                rows={5}
                value={values.body}
                onChange={handleChange}
              />
              <div>
                <label>Add Picture</label>
                <br />
                <FileBase
                  type="file"
                  multiple={false}
                  onDone={({ base64 }) =>
                    setValues({ ...values, image: base64 })
                  }
                />
                <br />
                <small>size limit: 10MB</small>
              </div>
              {!user?.result?.name ? (
                <Button 
                  className={classes.btn}
                  variant="outlined"
                  color="primary">
                    Sign in to post!
                </Button>
              ):(
                <Button
                  className={classes.btn}
                  variant="outlined"
                  color="primary"
                  type="submit"
                >
                  Post!
                </Button>
              )}
            </form>
          </Paper>
        </Fade>
      </Modal>
    </div>
  );
}

const mapStateToProps = (state) => ({
  posts: state.postReducer.posts,
});

export default connect(mapStateToProps, { createPost, updatePost })(PostForm);
