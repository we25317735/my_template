這個github記錄了我的學習歷程，使用了 Next.js 和 Express，並結合 XAMPP 的 MySQL 實現前後端功能開發。是我從資展畢業後, 結合了我在集訓時的所學和後續探索的經驗 。 


專案的內容涵蓋了一些網頁常見功能，同時展示了不同技術階段的實作過程, 以下是關於這個專案的介紹。

〈目前投入技術〉


  這個專案大致分了幾個 page, 並在每個 page 中模擬了其他類似的頁面會出現的功能, 而把目前所作的功能統合下來, 目前有:

    第三方登入：使用 Google 或是 Line 登入。
    後續綁定第三方: (目前是做到在現有的第三方帳號上, 在綁其他第三方帳號)
    購物車hook化：把購物車hook化, 並聯合商品頁做成 todoList,。
    Line Pay 結帳：集成 Line Pay 進行線上付款。
    WebSocket.io：實現使用者和課服之間的對話功能。


# 登入註冊部分

![圖片](https://github.com/user-attachments/assets/e3b0276e-49ec-49f6-8b99-cc399eafa913)

1. 信箱 登入/註冊
2. 登入按鈕隨者狀態變更, 從使用者確認到最後進行登入
3. 第三方登入

## 一般使用者

 這邊目前設定可以透過 email 去綁定電子信箱, 開始註冊時會傳送驗證碼到需要註冊的信箱,
 輸入驗證碼正確後即可創立一個新帳號, 後續可以直接用該信箱和密碼登入。

 在帳號註冊驗證的過程都是用 sweetalert 來進行步驟切換, 
 且過程中使用 API 來達成 email 寄送信件的操作。


 第二部分那邊, 會在輸入 email 之後, 系統會先判定該用戶是否存在,
 如果該用戶不存在, 就會跳出是否註冊的詢問,

 此時按鈕會變成 "忘記密碼" 的按鈕, 這邊有個設定是 '密碼不能小於3位數', 
 所以當使用者輸入密碼時, 只要密碼超過3位數, 按鈕就會自動變成 "登入" 按鈕。
 
 如果該用戶存在, 接下來則會要求使用者輸入密碼,


## 第三方登入

第三部分這邊相對地簡單一些, 選擇一個登入方式ㄝ, 一鍵註冊和登入一次搞定 

這部分使用的是 firebase 的 api, 以及 line 自己的登入方式,
雖然有點不同, 但原理都一樣











 
