$(document).ready(function() {

	$("ul.bef-tree > li:has(ul) > div").parent().prepend('<a href="#" class="collapsible-kt">&nbsp;</a>');
	
	$("ul.bef-tree > li:has(ul) > div").next().attr('style', 'margin: -7px 0 10px 10px;'); /*the sub ul*/

	$("ul.bef-tree > li:has(ul) > div").next().hide(); /*the sub ul*/


	$("ul.bef-tree > li:has(ul) > div").attr('style', 'margin: -32px 0 10px 15px;'); /*the parent checkbox, move to align with arrow*/
	$("ul.bef-tree > li > div").addClass('top-level');


	$('a.collapsible-kt').click(function() {

		$(this).toggleClass('expanded-kt');

		$(this).next('div').next().toggle();
		return false;

	});

	//.parent().wrap
	
	/* Change Apply and Reset buttons to say Search and Clear */
	$('#edit-submit-table-of-contents').attr('value', 'Search');
	$('#edit-submit-project-and-export').attr('value', 'Search');
	$('#edit-reset').attr('value', 'Clear');



	/*var checklistclean = [];
	$(":checked").each(function() {
		checklistclean.push($.trim( $("label[for='"+$(this).attr("id")+"']").text() ));
	})
	alert(checklistclean.join(", "));*/


	var comma_separated_list_label = $(".views-exposed-widget :checked").map(function() {
		return $.trim( $("label[for='"+$(this).attr("id")+"']").text() );
	}).get().join(", ");
	//alert(comma_separated_list_label);

	if(comma_separated_list_label) $(".search-note").html("<p>Showing results from " + comma_separated_list_label + "</p>");



});



