const express=require('express');

const router=express.Router();

const puppeteer=require('puppeteer');

const cherio =require('cherio');

const request= require('request')

const User=require("./UserImageContentModel")

const amaz=require('./amazon')

var fs = require('fs');
const { url } = require('inspector');
const { reverse } = require('dns');




//checking server response...
router.get("/myname",(req,res)=>{
    res.json("Hey its me!! Abubakar")
})




router.get('/imdbTopMovies', async(req,res,html)=>{


    await request('https://www.imdb.com/chart/top/?ref_=nv_mv_250',async(error,response,html)=>{

    const cherios=await cherio.load(html)
    const titlewrapper=await cherios('.lister-list')
    const moviename=titlewrapper.find('a').text()
    const year=titlewrapper.find('span').text()
    
    var Namearray=moviename.toString().split('/n')
    var Yearname=year.toString().split('/n')

    res.json({Namearray:Namearray,Years:Yearname})
    


    })
})


//Instagram bot

//https://www.instagram.com/accounts/login/
router.get('/Insta', async(req,res,html)=>{


    baseUrl="https://instagram.com/"


    const instagram={

        browser:null,
        page:null,

            initialize: async()=>
            {
                instagram.browser=await puppeteer.launch({
                headless:false
                                })
        

                instagram.page = await instagram.browser.newPage();
            },
    
        login:async()=>{
    
        
    await instagram.page.goto(baseUrl,{waitUntil:['load','networkidle0']})

    //await instagram.page.waitForNavigation({waitUntil:['load','networkidle0']})



    await instagram.page.type('input[name="username"]',"semper_.fi",{delay:50})

    await instagram.page.type('input[name="password"]',"afridi",{delay:50})

    
    instagram.page.click("#loginForm > div > div:nth-child(3) > button > div")

    //await new Promise(resolve => setTimeout(resolve, 1000));
    await new Promise(resolve => setTimeout(resolve, 1000));


    await instagram.page.waitForNavigation({waitUntil:['load','networkidle0']})

    //
    if(instagram.page.waitFor('#react-root > section > main > div > div > div > section > div > button'))
    {
        instagram.page.click("#react-root > section > main > div > div > div > section > div > button")
    }


    await instagram.page.waitForNavigation()

    if(instagram.page.waitFor('body > div.RnEpo.Yx5HN > div > div > div > div.mt3GC > button.aOOlW.HoLwm'))
    {
        instagram.page.click("body > div.RnEpo.Yx5HN > div > div > div > div.mt3GC > button.aOOlW.HoLwm")
    }
    

    let influencer_Name="laraib"
   
    await new Promise(resolve => setTimeout(resolve, 3000));
    //searchin people or tags from search bar

    await instagram.page.type('input[placeholder="Search"]',influencer_Name,{delay:50})    
    

    await new Promise(resolve => setTimeout(resolve, 4000));

    //selecting from search bar
    await instagram.page.click("#react-root > section > nav > div._8MQSO.Cx7Bp > div > div > div.LWmhU._0aCwM > div:nth-child(5) > div.drKGC > div > a:nth-child(1)")



    //select on Image
    await new Promise(resolve => setTimeout(resolve, 3000));
    await instagram.page.click("#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1) > a > div.eLAPa > div._9AhH0")
    

    

    await new Promise(resolve => setTimeout(resolve, 3000));

    for(i=0;i<6;i++){



        await new Promise(resolve => setTimeout(resolve, 3000));

        var newpost=new User({
        name:null,
        content:null,
        
    })

        //getting image content written by User        
        let text = await instagram.page.evaluate(()=>document.querySelector('body > div._2dDPU.RnrQH.CkGkG > div.zZYga > div > article > div.eo2As > div.EtaWk > ul > div > li > div > div > div.C4VMK > span').textContent);

        newpost.name=influencer_Name
        newpost.Content=text

        await newpost.save((err,post)=>{

            if(!err)
              {
                console.log("Post saved")
                }
            else
            throw err
            return
          })


          await new Promise(resolve => setTimeout(resolve, 3000));

        //Clicking on the next image
        await instagram.page.click("body > div._2dDPU.RnrQH.CkGkG > div.EfHg9 > div > div > a._65Bje.coreSpriteRightPaginationArrow")
        console.log("Text Readed Successfully of image number="+(i+1))

        }

        User.find({},(err,users)=>{
            if(!err)
            res.json(users)
            
            else
            return
        })


    }

}
    //body > div._2dDPU.RnrQH.CkGkG > div.Igw0E.IwRSH.eGOV_._4EzTm.BI4qX.qJPeX.fm1AK.TxciK.yiMZG > button
    await instagram.initialize()

    await instagram.login()

    console.log("You are on the news feed page....")
    
    await instagram.page.click("body > div._2dDPU.RnrQH.CkGkG > div.Igw0E.IwRSH.eGOV_._4EzTm.BI4qX.qJPeX.fm1AK.TxciK.yiMZG > button")
        


})

//Amazon Product reviews
router.get('/Amazon',async(req,res)=>{


    baseUrl="https://www.amazon.com/Hair-Food-Shampoo-Conditioner-Smoothing/product-reviews/B07K92VV2V/ref=cm_cr_getr_d_paging_btm_prev_1?ie=UTF8&reviewerType=all_reviews&pageNumber=1"


    const instagram={

        browser:null,
        page:null,

            initialize: async()=>
            {
                instagram.browser=await puppeteer.launch({
                headless:false
                                })
        

                instagram.page = await instagram.browser.newPage();
            },
    
        login:async()=>{
    
        
        await instagram.page.goto(baseUrl,{waitUntil:['load','networkidle0']})


        //await new Promise(resolve => setTimeout(resolve, 1000));

        for(let i=0;i<3;i++){

        await new Promise(resolve => setTimeout(resolve, 2000));
    
        let elements=await instagram.page.$$('#cm_cr-review_list > div[class*="a-section review aok-relative"]')

    
        let reviews=[]
        
        for(let element of elements)
        {
            var review=new amaz({
                reviews:null,
                
            })
            
            let title=await element.$eval(('[class="a-size-base review-text review-text-content"]'),node=>node.innerText.trim());
            reviews.push(title)
            review.reviews=title

            await review.save((err,post)=>{

                if(!err)
                  {
                    console.log("review saved successfully...")
                    }
                else
                throw err
                return
              })
    
            
        }

        await instagram.page.click("#cm_cr-pagination_bar > ul > li.a-last > a")
        


        console.log((i+1)+' page reviews saved..')
        
    }

    console.log("Amazon Reviews Scrapping Sucessful!!!")

    amaz.find({},(err,revs)=>{
        if(!err)
        res.json(revs)
        
        else
        return
    })
        //#cm_cr-pagination_bar > ul > li.a-last > a

    
        }
    }

    await instagram.initialize()
    await instagram.login()
    instagram.browser.close()

})



module.exports=router;
