/*===================================================================================*/
/*	CUSTOM JS/JQUERY SCRIPTS
/*===================================================================================*/

$(document).ready(function() {
    function addJobDataToPage(data) {
        var title = data.jobTitle ? data.jobTitle : '';
        var location = data.location || '';
        var jobcode = data.reference ? data.reference.split('-')[1] : '';
        var description = data.jobDescription || '';
        var startDate = data.startDate || '';
        $('#jobTitle').text(title);
        $('#jobId').text('Job Reference Number ' + jobcode);
        $('#jobLocation').text(location);
        $('#jobDescription').html(description);
        $('#startDate').text('Start date: ' + startDate.slice(5, 7) + '-' + startDate.slice(8) + '-' + startDate.slice(0, 4));
    }

    var pathname = window.location.href;

    if (pathname.indexOf('careers') > -1) {
        var ajaxUrl = window.location.hostname ? 'https://nx1kkbgfua.execute-api.us-east-2.amazonaws.com/Stage/jobDetailList' : 'http://localhost:8080/rcg/jobDetailList';
        $.ajax({
            url: ajaxUrl,
            method: 'GET',
            cache: false
        })
            .done(function (data) {
                // sort by decending Job ID to keep the newest jobs on top of the list
                var sortedData = data.sort(function(a, b) {
                    return parseInt(b.reference.slice(4)) - parseInt(a.reference.slice(4));
                });

                sortedData.forEach(function (element) {
                    var title = element.jobTitle;
                    var location = element.location;
                    var reference = "" + element.reference.slice(4);
                    var node = "<tr><td class=\"table-jobId-col\" data-value=\" " + reference + "\"><a href=\"job-details.html?jobcode=" + reference + "\">" + reference + "</a></td><td data-value=" + title + " class\"job-title-td\"><a href=\"job-details.html?jobcode=" + reference + "\">" + title + "</a></td><td data-value=\"" + location + "\" class=table-location-col>" + location + "</td></tr>";
                    var $target = $("#testTbody");
                    $target.append(node);
                });
            })


        // Table search function
        var activeSystemClass = $('.list-group-item.active');

        //something is entered in search form
        $('#system-search').keyup(function () {
            var that = this;
            // affect all table rows on in systems table
            var tableBody = $('.table-list-search tbody');
            var tableRowsClass = $('.table-list-search tbody tr');
            $('.search-sf').remove();
            tableRowsClass.each(function (i, val) {

                //Lower text for case insensitive
                var rowText = $(val).text().toLowerCase();
                var inputText = $(that).val().toLowerCase();
                if (inputText != '') {
                    $('.search-query-sf').remove();
                    tableBody.prepend('<tr class="search-query-sf"><td colspan="6"><strong>Searching for: "'
                        + $(that).val()
                        + '"</strong></td></tr>');
                }
                else {
                    $('.search-query-sf').remove();
                }

                if (rowText.indexOf(inputText) == -1) {
                    //hide rows
                    tableRowsClass.eq(i).hide();

                }
                else {
                    $('.search-sf').remove();
                    tableRowsClass.eq(i).show();
                }
            });
            //all tr elements are hidden
            if (tableRowsClass.children(':visible').length == 0) {
                tableBody.append('<tr class="search-sf"><td class="text-muted" colspan="6">No entries found.</td></tr>');
            }
        });
    }


    if (pathname.indexOf('job-details') > -1) {
        var hostname = window.location.hostname ? window.location.hostname : 'http://localhost:8080';
        var urlSearch = window.location.search;
        var jobcode = urlSearch ? urlSearch.split('=')[1] : '1000';
        var ajaxUrl = window.location.hostname ? "https://gnjin6lwhk.execute-api.us-east-2.amazonaws.com/Stage/jobDetail?jobId=" : "http://localhost:8080/rcg/jobDetail?jobId=";
        $.ajax({
            url: ajaxUrl + jobcode,
            method: 'GET',
            cache: false
        })
            .done(function (data) {
                addJobDataToPage(data[0]);
            })
            .fail(function () {
                console.log('job description call failed')
                addJobDataToPage({
                    location: 'not found',
                    jobTitle: 'Job Not Found',
                    jobDescription: '<p>not found</p>',
                    startDate: '0000-00-00'
                });
            });

        // add jobId to Apply Now button href
        var updateHostName = 'https://www.ryancgroup.com';
        if (!window.location.hostname || window.location.hostname.indexOf('test.ryancgroup.com') > -1){
            updateHostName = 'https://test.ryancgroup.com';
        }
        var updatedHref = "https://usportal.tracker-rms.com/theryanconsultinggroup/portal/register.asp?urlRedirect=" + updateHostName + "/register.html" + urlSearch;
        $('#applyNowButton').attr('href', updatedHref);
    }

    if (pathname.indexOf('register') > -1) {
        var urlSearch = window.location.search;
        if(urlSearch) {
            // add go back link
            var htmlLink = "<h4><u><a href=\"job-details.html" + urlSearch + "\">Back to Job Description</a></u></h4>";
            $('#backToJobDescription').html(htmlLink);
        }
    }
});
