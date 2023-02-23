//used to perform operations on files

const fs = require("fs");

const write = (fileName, data) => {
  fs.writeFile(fileName, data, (err) => {
    if (err) throw err;
    console.log(`File ${fileName} created and written!`);
  });
};

const read = (fileName) => {
  fs.readFile(fileName, (err, data) => {
    if (err) throw err;
    console.log(data.toString());
  });
};

const update = (fileName, insert) => {
  fs.appendFile(fileName, insert, (err) => {
    if (err) throw err;
    console.log(`File ${fileName} updated!`);
  });
};

const rename = (oldName, newName) => {
  fs.rename(oldName, newName, (err) => {
    if (err) throw err;
    console.log(`File ${oldName} renamed to ${newName}`);
  });
};

const deleteFile = (fileName) => {
  fs.unlink(fileName, (err) => {
    if (err) throw err;
    console.log(`File ${fileName} deleted successfully`);
  });
};

write("sample.txt", "Hello World!");
read("sample.txt");
update("sample.txt", "\nNew Append");

