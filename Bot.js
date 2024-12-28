let prompt = document.querySelector("#prompt");
let submitBtn = document.querySelector("#submit");
let chatContainer = document.querySelector(".chat-container");
let imageBtn = document.querySelector("#image");
let image = document.querySelector("#image img");
let imageinput = document.querySelector("#image input"); 

const API_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyC2TzGDQ2ToxAi1VCUuy-m_9fgctkjZ1ao";
let user={
    message:null,
    file:{
        mime_type:null,
        data: null ,
    }
};

async function generateResponse(aiChatBox)
{     
    let text =  aiChatBox.querySelector(".ai-chat-area");
   let RequestOption = {
        method:"POST",
        Headers:{'Content-Type ': 'application/json'},
        body:JSON.stringify(
            {"contents":[
                {"parts":[{"text":user.message},(user.file.data?[{"inline_data":user.file}]:[])

                ]}
            ]}
        )
   }
       try{
       let response = await fetch(API_Url,RequestOption);
       let data = await response.json();
           
       let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim();
    //    console.log(apiResponse); 
       text.innerHTML = apiResponse ;
    }
       catch(error){
          console.log(error);
          
       }
       finally
       {
        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
        image.src= `kimg.svg`;
        image.classList.remove("choose");
        user.file={ }
       }
 
}

function createChatBox(html,classes){
    let div = document.createElement("div");
    div.innerHTML = html ;
    div.classList.add(classes) ;
    return div ;

}


function handleChatResponse(message)
{    
     user.message = message ;
     let html = `<img src="userchild.png" alt="userImg" id="userImg" width="9%">
            
            <div class="user-chat-area">
              ${user.message}
              ${user.file.data?`<img src ="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` :" "}
            </div>`
             prompt.value = " "; // for clear the input area 
            let userChatBox = createChatBox(html,"user-chat-box")
        
            chatContainer.appendChild(userChatBox);

            chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"});

            //   AI chat area start here 

            setTimeout(()=>{
                let html =` <img src="pngwing.com.png" alt="AI-img" id="AI-img" width="10%">
       
            <div class="ai-chat-area">
              <img src="newLoading.gif" alt="" class="loading-gif" width="60px">
            </div>`
            let aiChatBox = createChatBox(html,"ai-chat-box");
            chatContainer.appendChild(aiChatBox);
            generateResponse(aiChatBox);

            },800);
            
           


}

prompt.addEventListener("keydown",(e)=>{
    if(e.key=="Enter")
    {
        handleChatResponse(prompt.value);
        
    }
   
});

submitBtn.addEventListener("click",(e)=>{
    handleChatResponse(prompt.value);
});


imageinput.addEventListener("change",()=>{
    const file = imageinput.files[0] ;
    if(!file)return ;

    let reader = new FileReader() ;
    reader.onload = (e)=>{
    
        let base64string = e.target.result.split(",")[1] ;
       user.file ={
            mime_type:file.type,
            data: base64string,
        }
        image.src= `data:${user.file.mime_type};base64,${user.file.data}`
         image.classList.add("choose");
    }
      

    reader.readAsDataURL(file)

})

imageBtn.addEventListener("click",()=>{
    imageBtn.querySelector("input").click(); 
})