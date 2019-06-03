$(function() {

    $("#aboutButton").click(function() {
        $('#aboutModal').modal('show');//Öppna about-modal
    });


    $("#jam_start").click(function() {
        if($("#key_select").val() == "Key"){
            $('#noKeyModal').modal('show');//ifall användaren inte väljer någon tonart
        }
        else if($("#tempo_select").val() == "Tempo"){
            $('#noTempoModal').modal('show');//Ifall användaren inte väljer något tempo
        }

        else{
        $.ajax({//Ajax anrop
            type: "GET",
            url: "./jamtracks.xml",//Länk till xml
            dataType: "xml",
            success: function(xml) {
                var searchedKey = $("#key_select").val();//Sökt tonart
                var searchedMode = "";//Sökt moll/dur

                if($("#major_select").is(':checked')){  //Kolla vilken 
                    searchedMode = "Major";
                }
                else{
                    searchedMode = "Minor";
                }

                var searchedTempo = $("#tempo_select").val();//Sökt tempo
                var matchedTracks = [];//Array för matchade tracks

                $(xml).find("track").each(function() {//Loopar genom xml
                    if ($(this).find("key").text() == searchedKey && $(this).find("mode").text() == searchedMode && $(this).find("tempo").text() == searchedTempo) {
                        //hittade en jamtrack
                        matchedTracks.push($(this).find("url").text());//lägger in den till arrayen
                    }

                });
                if (matchedTracks.length == 0) {//Om inga tracks hittades
                    
                    $(xml).find("track").each(function() {//Loopa igenom
                    if ($(this).find("key").text() == searchedKey && $(this).find("mode").text() == searchedMode){
                        //Tar fram en jamtrack i samma tonart och moll/dur fast annat tempo
                        matchedTracks.push($(this).find("url").text());
                        $('#noFindTrackModal').modal('show');
                    }
                
                });
                
            } 

                    $(".player_frame").empty();//Tömmer iframen
                    var newTrack = Math.floor((Math.random() * Object.keys(matchedTracks).length - 1) + 1);
                    //SLumpar ett nummer som används som index på arrayen
                    $(".player_frame").append( "<iframe width='686' height='473'src='" + matchedTracks[newTrack] +"&iv_load_policy=3'></iframe>" );
                    //Skicka in den hittade jamtracken till iframen.
            }
        });
    }
    });


    $("#random_start").click(function() {//Slumpmässig jamtrack händelse
        $(".player_frame").empty();//Tömmer ifram
        $.ajax({
            type: "GET",
            url: "./jamtracks.xml",
            dataType: "xml",
            success: function(xml) {
                var matchedTracks = [];
                $(xml).find("track").each(function() {
                    matchedTracks.push($(this).find("url").text());//Lägger till alla tracks i arrayen
                });
                var newTrack = Math.floor((Math.random() * Object.keys(matchedTracks).length - 1) +1);
                //Slumpar ett nummer, väljer det numret som index på arrayoch skickar in en i iframen
                $(".player_frame").append( "<iframe width='686' height='473'src='" + matchedTracks[newTrack] +"'></iframe>" );
            }
        });
    });
});