import { Input } from "@mui/base";
import "./style.css";

function SearchInput() {
  return (
      <Input
        slotProps={{
          root: { className: "input-container" },
          input: { className: "transparent-input-style transparent-input-style::placeholder", placeholder: "Поиск по имени...", type: "text" },
        }}
      />
  );
}

export default SearchInput;
