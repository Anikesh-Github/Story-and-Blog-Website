const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

/**
 * GET /
 * HOME
*/
router.get('', async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    // Count is deprecated - please use countDocuments
    // const count = await Post.count();
    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});

// router.get('', async (req, res) => {
//   const locals = {
//     title: "NodeJs Blog",
//     description: "Simple Blog created with NodeJs, Express & MongoDb."
//   }

//   try {
//     const data = await Post.find();
//     res.render('index', { locals, data });
//   } catch (error) {
//     console.log(error);
//   }

// });


/**
 * GET /
 * Post :id
*/
router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    }

    res.render('post', {
      locals,
      data,
      currentRoute: `/post/${slug}`
    });
  } catch (error) {
    console.log(error);
  }

});


/**
 * POST /
 * Post - searchTerm
*/
router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: "Seach",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
      ]
    });

    res.render("search", {
      data,
      locals,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});


/**
 * GET /
 * About
*/
router.get('/about', (req, res) => {
  res.render('about', {
    currentRoute: '/about'
  });
});


function insertPostData() {
  Post.insertMany([
    {
      title: "Likeable",
      body: "She could see she was becoming a thoroughly unlikable person. Each time she opened her mouth she said something ugly, and whoever was nearby liked her a little less. These could be strangers, these could be people she loved, or people she knew only slightly whom she had hoped would one day be her friends. Even if she didn't say anything, even if all she did is seem a certain way, have a look on her face, or make a soft sound of reaction, it was always unlikable—except in the few cases that she fixed herself on being likable for the next four seconds (more than that was impossible) and sometimes that worked, but not always. Why couldn't she be more likable? What was the problem? Did she just not enjoy the world anymore? Had the world gotten away from her? Had the world gotten worse? (Maybe, probably not. Or probably in some ways but not in the ways that were making her not like it). Did she not like herself? (Well, of course she didn't, but there was nothing new in that.) Or had she become less likable simply by growing older—so that she might be doing the same thing she always did, but because she was now forty-one, not twenty, it had become unlikable because any woman doing something at forty-one is more unlikable than a woman doing it at twenty? And does she sense this? Does she know she is intrinsically less likable and instead of resisting, does she lean into it, as into a cold wind? Maybe (likely) she used to resist, but now she sees the futility, so each morning when she opens her mouth she is unlikable, proudly so, and each evening before sleep she is unlikable, and each day it goes on this way, she getting more unlikable by the hour, until one morning she will be so unlikable, inconveniently unlikable, that she will have to be shoved into a hole and left there."


    },
    {
      title: "Miracles",
      body: "WE WATCHED OUR FATHER take the jar out to the patio on the day we had been waiting for since he put the spider into it with its egg sac. It was a black widow spider which we knew never to touch in the garden and to know by the red bow on its belly. We’d been living in the country since our stark raving mad mother started calling the apartment from her orbit. Our father lay down near the jar, on his side. He was always showing us stuff around the farm. He was growing a beard, always tired and patient. There was a barn with a horse in it we were taking care of. He said a lot about learning to take care of others as a part of growing up, and we watched him with eyes too big for our heads. We gathered around the jar and put our noses to it in turn, looking for the movement he said to look for in the egg sac, how you could see it was time by shadows crossing. We were getting a little bored when the babies started to come out, just like he said. They were smaller than anything, and the big mother spider, you couldn’t tell if she was paying attention. The babies were spreading out over the inside of the jar, the miracle of life. They were making their ways to the air holes punched in the lid. Our father just watched and commented for our benefit. He put a stick to an air hole and we watched babies crawl up it. Spiders crawl their whole lives. We watched, but some of our attention wandered. We were new to the countryside, new life surrounding us. I remember a lot of things from that place besides this. After the apocalypse, a brother of mine said, 'Do you remember if you were nervous with all those poison spiders radiating from the jar? Do you remember that we didn’t have any insect spray because we’d just moved out there but he had a can of hairspray and that’s what he sprayed on them, just as they were getting away? Why did we have hairspray? Was it hers?'"

    },
    {
      title: "The Last Lighthouse Keeper",
      body: "On the edge of a rugged cliff, an old lighthouse stood, its light dimmed over time. Jasper, the last keeper, spent his days polishing the lens and reminiscing about the sea. One stormy night, a ship's distress signal flickered on the horizon. Jasper, driven by a final burst of determination, relit the beacon. Through the tempest, the ship found its way safely to shore. As dawn broke, Jasper's lighthouse shone brightly one last time before he disappeared into the morning mist, leaving behind a legacy of hope and guiding light."
    },
    {
      title: "The Huntress",
      body: "For fear of the huntress the city closed like an eye. Only my window stayed open, because, as a foreigner, I didn’t know better. In the morning, poor children would scrub the stains from the roofs. Now the rain-dark head came down and rested on the dome of the embassy. The moon shed feathers of light, as if molting. In the morning the eaves would drip with pinkish foam. A stench of fur came in at the window. I went to slam it shut, but instead I stood there, fingers gripping the edge of the frame. I closed my eyes in the searching heat. All over the city people were taking shelter in their cellars and under their beds. Once there were two children and they were the only ones on their block who kept the passion for monsters after they grew up. The only ones. Why should that be? Our dad used to tell us stories of camel herding. He would scare us by mimicking the sound of a lion. This lion didn’t sound like any lion from movies or games or anything. It had a whining hunger. It was a tenor lion. Her prowler’s voice, surprisingly high and small. Like a question. All over the city people were covering their heads. The leaves outside my window shrank and smoked. Exiles and insomniacs share this feeling: that each is the only one. I feel like I’m turning into this fierce person. A taskmaster to myself, like a ballet dancer or a monk. Are monks happy? No, they are not interested in that category of feeling. But I’m supposed to be. I’m an American. The Huntress left dark patches wherever she passed. She left a streak. In the morning, the hotel staff would find me unconscious, gummed to the floor. The proprietor weeping, for nothing like this had ever happened in his establishment, nothing. Had I not read the instructions on the desk? The fierceness can be seen around the mouth. I compress my lips when I’m thinking. Our dad was the same way. In the morning the staff would run me a bath. Now the Huntress bent to my window, but she was not there to feed. She was there as a witness."

    },
    
    

    
  ])
}

//insertPostData();


module.exports = router;


