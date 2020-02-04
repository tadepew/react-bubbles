import React, { useState } from "react";
import { axiosWithAuth } from "./axiosWithAuth";
const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors }) => {
  console.log(colors);
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };

  const saveEdit = e => {
    e.preventDefault();
    console.log("Saving edits to color", colorToEdit);
    axiosWithAuth()
      .put("colors/" + colorToEdit.id, colorToEdit)
      .then(response => {
        console.log("Color edited:", response);
        // rebuild color array in same order as before
        let updatedColors = [];
        for (let i = 0; i < colors.length; i++) {
          if (colors[i].id === colorToEdit.id) {
            updatedColors = [...updatedColors, colorToEdit];
          } else {
            updatedColors = [...updatedColors, colors[i]];
          }
        }

        updateColors(updatedColors);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const deleteColor = color => {
    console.log("delete", color);
    axiosWithAuth()
      .delete("colors/" + color.id)
      .then(response => {
        console.log("deleted", response);
        let remainingColors = colors.filter(
          existingColor => existingColor.id !== color.id
        );
        updateColors(remainingColors);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span
                className="delete"
                onClick={e => {
                  e.stopPropagation();
                  deleteColor(color);
                }}
              >
                x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      <div className="spacer" />
      {/* stretch - build another form here to add a color */}
    </div>
  );
};

export default ColorList;
