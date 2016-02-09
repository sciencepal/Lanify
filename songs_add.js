var mongoose = require('mongoose');
var fs = require('fs');
var pa = require('path');
var Sync = require('sync');
var mm = require('musicmetadata');

mongoose.connect('mongodb://localhost/music');

function endsWith(str, suffix) {
   return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
function isBlank(str) {
   return (!str || /^\s*$/.test(str));
}
function capitalizeFirstLetter(string) {
   console.log('here',string);
   return string.charAt(0).toUpperCase() + string.slice(1);
}

/*
function to remove url from the string 
*/
function delete_info(str){
   str=str.replace(" - DJMaza.Info", "");
   str=str.replace(" - www.Songs.PK", "");
   str=str.replace(" -  www.Songs.PK", "");
   str=str.replace("[www.DJMaza.Com]", "");
   str=str.replace(" - www.DJMaza.Com", "");
   str=str.replace(" - www.MP3Khan.Com", "");
   str=str.replace(" - DJMaza.Com", "");
   str=str.replace(" - SceneDL", "");
   str=str.replace(" - DownloadMing.SE", "");
   str=str.replace(" - MP3Khan.Com", "");
   str=str.replace("[PagalWorld.com]", "");
   str=str.replace("(PagalWorld.com)", "");
   str=str.replace("[www.Mp3HunGama.IN]", "");
   str=str.replace(" - www.SongsPK.info", "");
   str=str.replace("- Songspk.LINK", "");
   str=str.replace("- DJMaza.Link", "");
   str=str.replace("[www.LatestZone.Net]", "");
   str = str.trim();
   return str;
}

function split_Artist(str){
   str1 = str[0].split(/[&,]+/);
   for(var i=0;i<str1.length;i++){
      str1[i]=delete_info(str1[i]);
   }
   return str1;
}
var Schema = mongoose.Schema;

// create a schema

var songScheme = new Schema({
   title:String,
   path:String,
   artist:Array,
   album:String,
   length:String,
   release_date: Date,
   album_art_small:String,
   album_art:String,
   rating:Number,
   views:Number,
   genre:String,
   likes:Number,
   dislikes:Number,
},{ collection: 'songs' });

// the schema is useless so far
// we need to create a model using it

var Song = mongoose.model('Song',songScheme);
var name;

//var path= "/myfile/dc/lanify/english";
var path= "/myfile/dc/lanify/hindi/";
var path1="hindi/";
var song_folder_arr = fs.readdirSync(path);
//console.log("hello",song_folder_arr);
Sync(function(){
   var cnt=0;
   for(j=0;j<song_folder_arr.length;j++){
      var folder = path+song_folder_arr[j];

      song_arr = fs.readdirSync(folder);
      var cntr=0,tags;
      for(var i=0;i<song_arr.length;i++)
      {
         var file = song_arr[i];
         if(endsWith(file, ".mp3"))
            {
               // Function.prototype.sync() interface is same as Function.prototype.call() - first argument is 'this' context
               var pat = path1+song_folder_arr[j]+'/'+file;
               var time,metadata;
               try{
                  metadata = mm.sync(null,fs.createReadStream("/myfile/dc/lanify/"+pat),{duration:true});
                  time=metadata.duration;
                  //console.log(metadata);
               }
               catch(e){
                  console.log(e);
               }
               var time1 = parseInt(time);
               var min = time1/60;
               var sec=time%60;
               if(isNaN(sec)){
                  sec='00';
               }
               else
                  sec=Math.floor(sec);
               if(isNaN(min)){
                  min='00';
               }
               else
                  min=Math.floor(min);
               //console.log('hello',metadata);
               //console.log('hello1');
               time = min +":"+sec;
               if(isBlank(metadata.title))
                  {
                     //console.log("----------->the string was empty");
                     continue;
                  }
                  //console.log('hello1');
                  arr_artist=split_Artist(metadata.artist);
                  //console.log('hello2');
                  var title = delete_info(metadata.title);
                  var album = delete_info(metadata.album);
                  var newSong = Song({
                     title:title,
                     album:album,
                     artist:arr_artist,
                     genre:metadata.genre,
                     path:pat,
                     album_art_small:path1+song_folder_arr[j]+'/AlbumArtSmall.jpg',
                     album_art:path1+song_folder_arr[j]+'/Folder.jpg',
                     rating:0,
                     views:0,
                     likes:0,
                     dislikes:0,
                     length:time
                  });
                  console.log('Song added',cnt+'-->'+title);
                  cnt++;

                  newSong.save(function(err) {
                     if (err) throw err;
                  });
            }
            //if(endsWith(file,".jpg"))
            //{
            //if(cntr==0)
            //fs.createReadStream(path+song_folder_arr[j]+'/'+file).pipe(fs.createWriteStream(path+song_folder_arr[j]+'/AlbumArtSmall1.jpg'));
            //if(cntr==1)
            //fs.createReadStream(path+song_folder_arr[j]+'/'+file).pipe(fs.createWriteStream(path+song_folder_arr[j]+'/Folder1.jpg'));
            //cntr++;
            //}
      }
   }
});
console.log("finished adding song");


