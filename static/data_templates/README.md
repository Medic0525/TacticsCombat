# DATA TEMPLATES

為了讓大家在寫程式時，對於同一個資料能有相同的讀寫格式，這個資料夾專門存放`json`等檔案，藉以規範。
簡單來說，就是統一度量衡啦！

## 命名

請將檔案以 `xxx_ex.json` 或`ooo_ex.py`等方式命名！

## 已登記的資料

- stage_ex.json
- - 場景資料模板。
- - `grids`: 背景
- - `tiledict`: 每個網格顯示的內容。目前是顏色，將來會儲存圖檔。
- - `sprites`: 是一個`陣列`，裡面包著儲存每個角色資料的`字典`。目前僅儲存網格位置`gridpos`。之後應該要跟`playerdata_ex.json`同步。

- playerdata_ex.json
- - 單個玩家的資料模板。