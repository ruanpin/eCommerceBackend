# 線上應用程式連結  
\[可於面試時Demo\]  
前端專案Demo:  
https://e-commerce-psi-puce.vercel.app/  


# 專案描述  
**Project Name:**  
eCommerceBackend  

**Tech Stack:**  
Node.js、Express、MySQL、JWT、bcryptjs、CORS、Nodemon  

# 後端架構分層  
**Routes:**  
負責接收前端請求，並把請求導向對應的 Controller  

**Controllers:**  
負責處理來自路由的請求以及回應 ，呼叫 Service 完成業務邏輯 

**Services:**  
專注處理商業邏輯或運算流程    

**Models:**  
負責與資料庫溝通，封裝 SQL 查詢    


# 已實作的功能  
**1.註冊功能:**  
使用者能在註冊頁面進行帳號註冊，輸入姓名、電子信箱、密碼等資料即可進行註冊功能   

**2.登入功能:**  
使用者能在登入頁面進行登入，輸入電子信箱、密碼即可登入，也提供記住帳號功能，登入後可使用更多功能，如購物車、商品購買、訂單查詢等功能   

**3.搜尋功能:**  
使用者能在搜尋欄中搜尋商品，系統將會自動搜尋相關商品，並將搜尋結果顯示於下方，下方搜尋結果展示商品圖片、商品名稱、單價等資訊，並以分頁器調控展示搜尋結果    

**4.商品詳情:**  
此頁面展示商品資訊，如：商品圖片、類別、商品名稱、單價、商品描述、可選顏色、可選尺寸、數量、剩餘庫存等，且使用者可進行加入購物車、直接購買等操作(需登入)  

**5.購物車功能:**  
會員可在此頁面進行購物車查看、修改商品數量、移除購物車中商品、選擇品項進行結帳等功能  

**6.會員資料管理功能**  
會員可在此頁面進行修改自身帳號資訊等功能

**7.會員訂單管理功能:**  
會員可在此頁面進行查看先前所有訂單資料，並以分頁器調控展示搜尋結果


# 如何在本地端運行專案
**在開始之前，請確保你的開發環境已安裝以下工具：**  
Node.js 18+  
npm  
MySQL  
Git  

**在終端機中執行**  
1.git clone https://github.com/ruanpin/eCommerceBackend.git  
2.cd eCommerceBackend  
3.npm install  
4.在根目錄新增 .env 檔案  
PORT=4999  
DB_HOST=localhost  
DB_USER=root  
DB_PASSWORD=your_password_word  
DB_NAME=ecommerce_db  
JWT_SECRET=your_jwt_key  

5.npm run dev  