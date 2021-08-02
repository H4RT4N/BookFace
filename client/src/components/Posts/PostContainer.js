import React from "react";

// material ui
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Menu,
  MenuItem,
} from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 345,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 16,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  textArea: {
    maxHeight: 200,
    overflowY: "auto",
    overflowWrap: "break-word",
    scrollbarWidth: "none", // for firefox
    "&::-webkit-scrollbar": { width: 0 },
  },
  activeLikeBtn: {
    color: "red",
  },
  inActiveLikeBtn: {
    color: "grey",
  },
}));

function PostContainer(props) {
  const classes = useStyles();

  // options menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { author, authorId, body, date, image, likes, _id } = props.post;
  let disableLike = true;
  let disableOptions = true;
  if(props.user) {
    disableLike = false;
    if(props.user?.result?.googleId == authorId || props.user?.result?._id == authorId)
      disableOptions = false;
  }
  return (
    <Card className={classes.root} variant="outlined">
      <CardHeader
        action={
          <IconButton aria-label="options" disabled={disableOptions} onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
        }
        title={author}
        subheader={date.substring(0, 10)}
      />
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            props.onEdit(_id);
            handleClose();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem onClick={() => props.onDelete(_id)}>Delete</MenuItem>
      </Menu>
      {image !== "" ? (
        <CardMedia
          className={classes.media}
          image={image}
          title="Media"
          alt="Media"
        />) : (<div />)
      }
      {body !== "" ? (
        <CardContent>
          <Typography
            className={classes.textArea}
            variant="body2"
            color="textPrimary"
            component="p"
          >
            {body}
          </Typography>
        </CardContent>) : (<div />)
      }
      <CardActions disableSpacing>
        <IconButton 
          aria-label="Like"
          onClick={() => props.onLike(_id)}
          disabled={disableLike}
        >
          {likes.find(user => user == (props.user?.result?.googleId || props.user?.result?._id)) ? 
          (<FavoriteIcon className={classes.activeLikeBtn} />):
          (<FavoriteIcon className={classes.inActiveLikeBtn} />)}
        </IconButton>
        <Typography variant="caption">{likes.length}</Typography>
      </CardActions>
    </Card>
  );
}

export default PostContainer;
