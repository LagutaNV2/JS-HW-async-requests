//  this.value возвращает полный путь к выбранному файлу,
//включая директории (например, C:\Users\Username\Documents\example.txt).
// split("\\") — Метод split() разделяет строку пути файла на части
//по символу обратного слэша (\), который используется в путях
// на компьютерах с ОС Windows.
// Это разбивает полный путь к файлу на массив строк,
// где последняя строка — это имя файла.

// Так как после метода split() у нас получился массив частей пути
// (например, ["C:", "Users", "Username", "Documents", "example.txt"]),
// последний элемент этого массива (с индексом fileName.length - 1)
// — это имя файла, который выбрал пользователь.
// Здесь мы сохраняем в переменную fileName только имя файла,
// отбрасывая путь.

document.getElementById("file").onchange = function() {
  const fileDesc = document.querySelector(".input__wrapper-desc");
  let fileName = this.value.split("\\");
  fileName = fileName[fileName.length - 1];
  fileDesc.textContent = fileName;
};
