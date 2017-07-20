/**
 * ownCloud - rootviewer
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Hugo Gonzalez Labrador (CERN) <hugo.gonzalez.labrador@cern.ch>
 * @copyright Hugo Gonzalez Labrador (CERN) 2017
 */

(function ($, OC, OCA) {

	var isRootFileOpen = false;

	function setUpEditor(fileURL, publicLinkRender) {
		isRootFileOpen =  true;
		var mainDiv = $('#rootviewer');

		if(mainDiv.length < 1)
		{
			mainDiv = $('<div id="rootviewer"></div>');
			mainDiv.css('position', 'absolute');
			mainDiv.css('top', '0');
			mainDiv.css('left', '0');
			mainDiv.css('width', '100%');
			mainDiv.css('height', '100%');
			mainDiv.css('z-index', '200');
			mainDiv.css('background-color', '#fff');

			var frame = $('<div id="rootviewer-div"></div>');
			frame.css('position', 'absolute');
			frame.css('top', '0');
			frame.css('left', '0');
			frame.css('width', '100%');
			frame.css('height', '100%');

			mainDiv.append(frame);
			if(publicLinkRender) {
				$('#preview').append(mainDiv);
			} else {
				$('#content').append(mainDiv);
			}
		}

		var loadingImg = $('<div id="rootviewer-loader"></div>');
		loadingImg.css('position', 'absolute');
		loadingImg.css('top', '50%');
		loadingImg.css('left', '50%');
		loadingImg.css('width', 'auto');
		loadingImg.css('height', 'auto');
		var img = OC.imagePath('core', 'loading-dark.gif');
		var imgContent = $('<img></img>');
		imgContent.attr('src',img);
		loadingImg.append(imgContent);

		var closeButton = $('<div></div>');
		closeButton.css('position', 'absolute');
		closeButton.css('top', '0');
		closeButton.css('left', '95%');
		closeButton.css('width', 'auto');
		closeButton.css('height', 'auto');
		closeButton.css('z-index', '200');
		closeButton.css('background-color', '#f00');
		var closeImg = OC.imagePath('core', 'actions/close.svg');
		var closeImgContent = $('<img></img>');
		closeImgContent.attr('src', closeImg);
		closeButton.append(closeImgContent);

		closeButton.click(function() { closeFile(); });

		$('#app-navigation').hide();
		$('#app-content').hide();

		mainDiv.append(loadingImg);
		mainDiv.append(closeButton);



		$('#rootviewer-loader').remove();
		var doc = $('#rootviewer-div');
		doc.append('<div id="simpleGUI"></div>');
		$('#simpleGUI').attr('files', fileURL);
		BuildSimpleGUI();

		// Adapt interface to make it simple
		$("#simpleGUI #urlToLoad").val(fileURL);
		$("#simpleGUI #urlToLoad").hide();
		$("#simpleGUI select[name='s']").hide();

		var layout = $("#simpleGUI #layout");
		var loadButton = $("#simpleGUI input[value='Load']");
		var resetButton = $("#simpleGUI input[value='Reset']");
		var buttonGroup = loadButton.parent();
		var form = $("simpleGUI form");
		var banner = "<p style='position:absolute; bottom: 0px;font-size:10px;'>This viewer is based on the <a href='http://root.cern.ch'><b>ROOT</b></a> data analysis framework developed at CERN.<br/> If you have questions or issues please refer to <a href='https://root.cern.ch/drupal/content/support'><b>ROOT Support page</b></a><br/>Integration done by <a href='https://cernbox.cern.ch'><b>CERNBOX</b></a> team</p>";
		var left = $("#simpleGUI #left-div");
		var right = $("#simpleGUI #right-div");

		left.append(banner);
		loadButton.hide();
		resetButton.hide();
		loadButton.click();
		layout.attr("style", "");
		$("#simpleGUI #left-div>h1").hide();
		$("#simpleGUI #left-div>p").hide();
		$("#simpleGUI #left-div form>p").hide();
		left.append(banner);
		left.css({border:"0px", "background-color":"white"});
		right.css({border:"0px", "background-color":"white"});

		var reloadButton = $('<input type="button" id="reload" value="Reload with selected layout">');
		buttonGroup.append(reloadButton);
		reloadButton.on('click', function(e) {
			resetButton.click();
			loadButton.click()
		});
	};

	var isPublicPage = function () {

		if ($("input#isPublic") && $("input#isPublic").val() === "1") {
			return true;
		} else {
			return false;
		}
	};

	var getSharingToken = function () {
		if ($("input#sharingToken") && $("input#sharingToken").val()) {
			return $("input#sharingToken").val();
		} else {
			return null;
		}
	};

	var closeFile = function(callback) {
		if(isRootFileOpen) {
			$('#rootviewer').remove();
			$('#app-navigation').show();
			$('#app-content').show();
			isRootFileOpen = false;

			if(callback) {
				callback();
			}
		}
	};

	var onView = function(filename, data) {
		if(isPublicPage()) {
			return onViewPublic(filename, data, getSharingToken());
		}
		var url = OC.generateUrl('/apps/rootviewer/load') + "?filename=" + encodeURIComponent(filename);
		setUpEditor(url);
	};

	var onViewPublic = function(filename, data, token) {
		url = OC.generateUrl('/apps/rootviewer/publicload') + "?filename=" + encodeURIComponent(filename) + "&token=" + token;
		setUpEditor(url);
	};

	var onViewPublicSingleFile = function(token) {
		url = OC.generateUrl('/apps/rootviewer/publicload') + "?filename=" + encodeURIComponent(filename) + "&token=" + token;
		setUpEditor(url);
	};

	$(document).ready(function () {
		JSROOT.source_dir = window.location.origin + window.oc_webroot + "/apps/rootviewer/js/";

		//loadConfig();
		if (OCA && OCA.Files) {
			OCA.Files.fileActions.register('application/root', 'Default View', OC.PERMISSION_READ, OC.imagePath('core', 'actions/play'), onView);
			OCA.Files.fileActions.setDefault('application/root', 'Default View');
		}
		// Doesn't work with IE below 9
		if(!$.browser.msie || ($.browser.msie && $.browser.version >= 9)){
			if ($('#isPublic').val() && $('#mimetype').val() === 'application/root' && $("input#passwordProtected").val() === "false") {
				var sharingToken = $('#sharingToken').val();
				onViewPublicSingleFile(sharingToken);
			}
		}
	});
})(jQuery, OC, OCA);