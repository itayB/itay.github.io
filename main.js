
{% load staticfiles %}

$(function() {
	$("#id_contactForm").submit(function(event) {
		//disable the default form submission
		event.preventDefault();
		
		$('#contactModal').modal('hide');
		$("#alert-message").empty().text("Sending your message..");
		$(".alert").show();

		var values = {};
		$.each($('#id_contactForm').serializeArray(), function(i, field) {
		    values[field.name] = field.value;
		});
		
		$.post("{% url 'contact' %}", values, function(returndata) {
			$("#alert-message").empty().text("Message has been sent successfully.");
		}).fail(function() {
			$("#alert-message").empty().text("Faild to send your message.");
		}).complete(function() {
			$("#id_content").val('');
		});

		return false;
	});

	$("#close-alert").click(function() {
		$(".alert").hide();
	});
	
	$("#language").click(function(event) {
		if ($(event.target).data("value") == "en-us" || $(event.target).data("value") == "en") {
			document.cookie = "language=he; path=/";
		}
		else {
			document.cookie = "language=en; path=/";
		}
		location.reload();
	});
	
	if ($("#project").length){
		$.get(window.location.pathname + "/tags", function(tags) {
			$.get(window.location.pathname + "/content", function(data) {
				$("#project").html(data);
				for (var i=0 ; i< tags.length ; i++)
					$("#tags").append("<span class=\"label label-info\" data-value=\"" + tags[i].slug +"\">" + tags[i].name + "</span>\n");
					
				$(".label-info").click(function(event) {
					window.location = "../results/" + $(event.target).data('value');
				});
				
				$(".img-thumbnail").click(function(event) {
					window.location = event.target.src;
				});
			});
		});
	}

	if ($("#results").length) {
		$.get(window.location.pathname + "/content", function(projects) {
			for (var i=0 ; i< projects.length ; i++) {
				$.get(".." + projects[i].contentUrl, function(content) {
					$("#temp").append("<div style=\"display: none;\">" + content + "</div>\n");
					var html = '';
					html += '<div class="panel panel-default">';
					html += '	<div class="panel-heading">';
					html += '		<h3 class="panel-title">' + $("#title").text() + '</h3>';
					html += '	</div>';
					html += '	<div class="panel-body">';
					html += $("#about").text();
					html += '		<div>';
					html += '			<a href="' + this.url.replace("/content","")  + '">'  + gettext('read more') + '...</a>';
					html += '		</div>';
					html += '	</div>';
					html += '</div>';
					html += '';
					$("#results").append(html);
					$("#temp").empty();
				});
			}
		});
	}


	var timelineBlocks = $('.cd-timeline-block'),
		offset = 0.8;

	//hide timeline blocks which are outside the viewport
	hideBlocks(timelineBlocks, offset);

	//on scolling, show/animate timeline blocks when enter the viewport
	$(window).on('scroll', function(){
		(!window.requestAnimationFrame) 
			? setTimeout(function(){ showBlocks(timelineBlocks, offset); }, 100)
			: window.requestAnimationFrame(function(){ showBlocks(timelineBlocks, offset); });
	});

	function hideBlocks(blocks, offset) {
		blocks.each(function(){
			( $(this).offset().top > $(window).scrollTop()+$(window).height()*offset ) && $(this).find('.cd-timeline-img, .cd-timeline-content').addClass('is-hidden');
		});
	}

	function showBlocks(blocks, offset) {
		blocks.each(function(){
			( $(this).offset().top <= $(window).scrollTop()+$(window).height()*offset && $(this).find('.cd-timeline-img').hasClass('is-hidden') ) && $(this).find('.cd-timeline-img, .cd-timeline-content').removeClass('is-hidden').addClass('bounce-in');
		});
	}


});

// Google Analytics code
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-39938785-2', 'itaybittan.herokuapp.com');
ga('send', 'pageview');

