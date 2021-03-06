$(document).ready(function() {

   $('#uploadForm').submit(function() {
      $("#status").empty().text("File is uploading...");

      $(this).ajaxSubmit({

         error: function(xhr) {
            status('Error: ' + xhr.status);
         },

         success: function(response) {
            console.log(response);
            $("#status").empty().text(response);
         }
      });

      return false;
   });    
   if(loggedin && adminp ){
   $('#rename_album').editable({
      type: 'text',
      pk: 1,
      url: '/lanify/admin/rename',
      title: 'Enter valid name',
      ajaxOptions: {
         type: 'get',
         dataType: 'json'
      },
      autotext:'never',
      params: function(params) {
         //originally params contain pk, name and value
         params.flag = 'album';
         params.album_name = $("#album_single_name").html();
         return params;
      }
   });
   $('#rename_artist').editable({
      type: 'text',
      pk: 1,
      url: '/lanify/admin/rename',
      title: 'Enter valid name',
      ajaxOptions: {
         type: 'get',
         dataType: 'json'
      },
      autotext:'never',
      params: function(params) {
         //originally params contain pk, name and value
         params.flag = 'artist';
         params.artist_name = $("#artist_single_name").html();
         return params;
      }
   });
   }
   else{
      $('#rename_album').webuiPopover({title:'Rename',content:'You need admin rights to rename'});
      $('#rename_artist').webuiPopover({title:'Rename',content:'you need admin rights to rename'});
   }
});


function showMetaData(data) {
   musicmetadata(data, function (err, result) {
      if (err) throw err;
      console.log(result);
      $('#title').val(delete_info(result.title));
      $('#album').val(delete_info(result.album));
      $('#artist').val(result.artist);
      $('#year').val(result.year);
      if (result.picture.length > 0) {
         var picture = result.picture[0];
         var url = URL.createObjectURL(new Blob([picture.data], {'type': 'image/' + picture.format}));
         var image = document.getElementById('myImg');
         image.src = url;
      }
      var div = document.getElementById('info');
      div.innerText = JSON.stringify(result, undefined, 2);
   });
}
function myFunction(){
   var x = document.getElementById("myFile");
   var txt = "";
   if ('files' in x) {
      if (x.files.length == 0) {
         txt = "Select one or more files.";
      } else {
         showMetaData(x.files[0]);
         for (var i = 0; i < x.files.length; i++) {
            txt += "<br><strong>" + (i+1) + ". file</strong><br>";
            var file = x.files[i];
            if ('name' in file) {
               txt += "name: " + file.name + "<br>";
            }
            if ('size' in file) {
               txt += "size: " + file.size + " bytes <br>";
            }
         }
      }
   } 
   else {
      if (x.value == "") {
         txt += "Select one or more files.";
      } else {
         txt += "The files property is not supported by your browser!";
         txt  += "<br>The path of the selected file: " + x.value; // If the browser does not support the files property, it will return the path of the selected file instead. 
      }
   }
   document.getElementById("demo").innerHTML = txt;
}

function delete_info(str){
   str = str.replace(/\([0-9]+\)/gi,""); //for format (1234)
   str = str.replace(/\[[0-9 a-z _ : , @ .]+\]/gi,""); //for anything beetween [word]
   str = str.replace(/[']+/,""); //for ' "
   str = str.replace(/["]+/,""); //for ' "
   str = str.replace(/[#]+/,""); //for ' "
   str = str.replace(/www\.[0-9 a-z]+\.com/gi,""); //for ' "
   str = str.replace(/www\.[0-9 a-z]+\.org/gi,""); //for ' "
   str = str.replace(/www\.[0-9 a-z]+\.pk/gi,""); //for ' "
   str = str.replace(/www\.[0-9 a-z]+\.se/gi,""); //for ' "
   str = str.replace(/www\.[0-9 a-z]+\.net/gi,""); //for ' "
   str = str.replace(/www\.[0-9 a-z]+\.info/gi,""); //for ' "
   str = str.replace(/www\.[0-9 a-z]+\.link/gi,""); //for ' "
   str = str.replace(/www\.[0-9 a-z]+\.inf/gi,""); //for ' "
   str = str.replace(/www\.[0-9 a-z]+\.eu/gi,""); //for ' "
   str = str.replace(/- [0-9 a-z]+\.com/gi,""); //for ' "
   str = str.replace(/@ [0-9 a-z]+\.com/gi,""); //for ' "
   str = str.replace(/- [0-9 a-z]+\.org/gi,""); //for ' "
   str = str.replace(/- [0-9 a-z]+\.PK/gi,""); //for ' "
   str = str.replace(/- [0-9 a-z]+\.SE/gi,""); //for ' "
   str = str.replace(/- [0-9 a-z]+\.net/gi,""); //for ' "
   str = str.replace(/- [0-9 a-z]+\.info/gi,""); //for ' "
   str = str.replace(/- [0-9 a-z]+\.link/gi,""); //for ' "
   str = str.replace(/- [0-9 a-z]+\.inf/gi,""); //for ' "
   str = str.replace(/[:]+/gi,''); //for ' "
   str=str.replace(" - DJMaza.Info", "");
   str=str.replace(" - DJMaza.INFO", "");
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
   str=str.replace("- Songspk.name", "");
   str=str.replace("- www.SongsLover.com", "");
   str=str.replace("- urgrove.com", "");
   str=str.replace("- Tinhkhucbathu.com", "");
   str=str.replace("www.Songs.PK", "");
   str=str.replace("www.djrobsonmichel.com", "");
   str=str.replace("{www.LatestZone.Net}", "");
   str=str.replace(":: www.FreeTeluguMp3Songs.com ::", "");
   str=str.replace("[Songs.PK]", "");
   str=str.replace("- PagalWorld.com", "");
   str=str.replace("- www.SongsLover.com", "");
   str = str.replace(/[-]+/,""); //for ' "
   str = str.trim();
   return str;
}
