import * as React from "react";
import { List, ListItemButton, ListItemText, Collapse } from "@mui/material";
import { Delete, ExpandLess, ExpandMore } from "@mui/icons-material/";

export default function CollapseComponent({
  title,
  color,
  onDelete,
  children,
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <List
      sx={{
        width: 1,
        my: 1,
      }}
    >
      <ListItemButton
        sx={{
          bgcolor: color,
        }}
        onClick={() => setOpen(!open)}
      >
        {onDelete && (
          <Delete
            sx={{ width: 40 }}
            onClick={onDelete}
          ></Delete>
        )}
        <ListItemText
          sx={{ textAlign: "center", fontSize: "0.875rem" }}
          primary={title}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </List>
  );
}
