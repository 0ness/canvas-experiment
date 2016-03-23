//Gruntプラグインの導入（watchの場合）
module.exports = function(grunt){

	grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-clean");

    grunt.initConfig({
		babel: {
			options: {
				/* ソースマップを出力させる場合はtrueにする */
				sourceMap: true
			},
			dist: {
				files: {
					/* 変換後のJSファイル: 変換前のJSファイル */
					"common/js/test/dot_01.js": "common/js/es2015/dot_01.js",
					"common/js/test/point-wave.js": "common/js/es2015/point-wave.js"
				}
			}
		},
        concat:{
            baseJS:{
                src:[
                    "common/js/jquery/jquery.js",
                    "common/js/jquery/easing.js",
                    "common/js/library.js",
					"common/js/pageInfo.js",
					"common/js/develop/perlin.js",
					"common/js/develop/stats.min.js",
                    "common/js/develop/dat.gui.min.js"
                ],
                dest:"common/js/base.js"
			},
			cifJS:{
				src:[
					"common/js/lib/jsgif-master/b64.js",
					"common/js/lib/jsgif-master/GIFEncoder.js",
					"common/js/lib/jsgif-master/LZWEncoder.js",
					"common/js/lib/jsgif-master/NeuQuant.js",
					"common/js/lib/jsgif-master/Cif-navigation.js"
				],
				dest:"common/js/develop/Cif.js"
			}
		},
        uglify:{
            baseJS:{
                src:"common/js/base.js",
                dest:"common/js/minify/base.js"
            },
            mainJS:{
                src:"common/js/main.js",
                dest:"common/js/minify/main.js"
            },
			cifJS:{
                src:"common/js/develop/Cif.js",
                dest:"common/js/minify/Cif.js"
            }
        },
        watch:{
			babel: {
				files: ["common/js/es2015/*.js"],
				tasks: ["babel"]
			},
			baseJS:{
				files:[
					"common/js/jquery/jquery.js",
					"common/js/jquery/easing.js",
					"common/js/library.js",
					"common/js/pageInfo.js",
					"common/js/develop/perlin.js",
					"common/js/develop/stats.min.js",
					"common/js/develop/dat.gui.min.js"
				],
				tasks:["concat:baseJS","uglify:baseJS"]
			},
			mainJS:{
				files:[
					"common/js/main.js"
				],
				tasks:["uglify:mainJS"]
			},
			cifJS:{
				files:[
					"common/js/lib/jsgif-master/*.js"
				],
				tasks:["concat:cifJS","uglify:cifJS"]
			}
        }
    });

    grunt.registerTask("default",["watch"]);
}

