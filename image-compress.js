/**
 * Created by clf on 2015/12/29.
 */

(function(window){
    'use strict'
    //polyfill
    if (!HTMLCanvasElement.prototype.toBlob) {
        Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
            value: function (callback, type, quality) {

                var binStr = atob( this.toDataURL(type, quality).split(',')[1] ),
                    len = binStr.length,
                    arr = new Uint8Array(len);

                for (var i=0; i<len; i++ ) {
                    arr[i] = binStr.charCodeAt(i);
                }

                callback( new Blob( [arr], {type: type || 'image/png'} ) );
            }
        });
    }

    /**
     *
     * @param source_img_obj£º a image object
     * @param quality £ºnumber between 0 and 1
     * @param output_format : mime type
     * @param callback : callback(blob)
     */
    function imgToBlob(source_img_obj,quality,output_format,callback){
        var mimeType='image/jpeg';
        if(typeof output_format!=='undefined'){
            mimeType=output_format;
        }

        var cvs=document.createElement('canvas');
        var ctx=cvs.getContext('2d').drawImage(source_img_obj,0,0);
        cvs.toBlob(function(blob){
            callback(blob);
        },mimeType,quality);
    }


    /**
     *
     * @param source_img_obj
     * @param quality
     * @param output_format
     * @returns {image object}
     */
    function imgCompress(source_img_obj,quality,output_format){
        var mimeType='image/jpeg';
        if(typeof output_format!=='undefined'){
            mimeType=output_format;
        }

        var cvs = document.createElement('canvas');
        cvs.width = source_img_obj.naturalWidth;
        cvs.height = source_img_obj.naturalHeight;
        var ctx = cvs.getContext("2d").drawImage(source_img_obj, 0, 0);
        var newImageData = cvs.toDataURL(mimeType, quality);
        var result_image_obj = new Image();
        result_image_obj.src = newImageData;
        return result_image_obj;
    }

    /**
     *
     * @param source_file_obj
     * @param max_size
     * @param callback:callback(blob)
     */
    function fileCompress(source_file_obj,max_size,callback){
        var imgTypeList=['image/jpeg','image/png','image/gif','image/bmp','image/jpg'];
        if(imgTypeList.indexOf(source_file_obj.type)==-1){
            return 'File type not supported';
        }
        var quality=1;
        if(source_file_obj.size>max_size){
            quality=max_size/source_file_obj;
        }

        var reader=new FileReader();
        reader.onload=function(e){
            var imgObj=new Image();
            imgObj.src=e.target.result;
            imgObj.onload=function(){
                imgToBlob(imgObj,quality,source_file_obj.type,function(blob){
                    callback(blob);
                });
            };
        };
        reader.readAsDataURL(source_file_obj);
    }


    /**
     *
     * @param source_file_obj
     * @param callback:callback(imgObj),imgObj is a image object
     */
    function fileToImg(source_file_obj,callback){
        var reader=new FileReader();
        reader.onload=function(e){
            var imgObj=new Image();
            imgObj.src=e.target.result;
            callback(imgObj);
        };
        reader.readAsDataURL(source_file_obj);
    }

    /**
     *
     * @param file_obj
     * @returns {Element}
     */
    function createDownload(file_obj){
        window.URL=window.URL||window.webkitURL;
        var file_download=document.createElement('a');
        file_download.href=window.URL.createObjectURL(file_obj);
        file_download.download=file_obj.type;
        file_download.textContent='Download this file';
        return file_download;
    }

}(window));