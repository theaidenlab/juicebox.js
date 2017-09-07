/*
 *  The MIT License (MIT)
 *
 * Copyright (c) 2016-2017 The Regents of the University of California
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the
 * following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,  FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

/**
 * Created by dat on 3/21/17.
 */
var hic = (function (hic) {

    var labels =
    {
        NONE: 'None',
        VC: 'Coverage',
        VC_SQRT: 'Coverage - Sqrt',
        KR: 'Balanced',
        INTER_VC: 'Interchromosomal Coverage',
        INTER_VC_SQRT: 'Interchromosomal Coverage - Sqrt',
        INTER_KR: 'Interchromosomal Balanced',
        GW_VC: 'Genome-wide Coverage',
        GW_VC_SQRT: 'Genome-wide Coverage - Sqrt',
        GW_KR: 'Genome-wide Balanced'
    };

    hic.NormalizationWidget = function (browser, $parent) {
        var self = this,
            $label;

        this.browser = browser;

        // container
        this.$container = $('<div class="hic-normalization-selector-container">');
        $parent.append(this.$container);

        // label
        $label = $('<div>');
        $label.text( (true === browser.config.miniMode) ? 'Normalization' : 'Norm.');
        this.$container.append($label);

        // select
        this.$normalization_selector = $('<select name="select">');
        this.$normalization_selector.attr('name', 'normalization_selector');
        this.$normalization_selector.on('change', function (e) {
            self.browser.setNormalization($(this).val());
        });
        this.$container.append(this.$normalization_selector);

        // spinner
        this.$spinner = $('<div>');
        this.$spinner.text('Loading ...');
        this.$container.append(this.$spinner);
        this.$spinner.hide();

        this.browser.eventBus.subscribe("MapLoad", this);
        this.browser.eventBus.subscribe("NormVectorIndexLoad", this);
        this.browser.eventBus.subscribe("NormalizationFileLoad", this);

    };

    hic.NormalizationWidget.prototype.startNotReady = function () {
        this.$normalization_selector.hide();
        this.$spinner.show();
    };

    hic.NormalizationWidget.prototype.stopNotReady = function () {
        this.$spinner.hide();
        this.$normalization_selector.show();
    };

    hic.NormalizationWidget.prototype.receiveEvent = function (event) {

        function updateOptions() {
            var dataset = event.data,
                normalizationTypes,
                elements,
                norm = this.browser.state.normalization;

            normalizationTypes = dataset.normalizationTypes;
            elements = _.map(normalizationTypes, function (normalization) {
                var label,
                    labelPresentation,
                    isSelected,
                    titleString,
                    valueString;

                label = labels[normalization] || normalization;
                isSelected = (norm === normalization);
                titleString = (label === undefined ? '' : ' title = "' + label + '" ');
                valueString = ' value=' + normalization + (isSelected ? ' selected' : '');

                labelPresentation = '&nbsp &nbsp' + label + '&nbsp &nbsp';
                return '<option' + titleString + valueString + '>' + labelPresentation + '</option>';
            });

            this.$normalization_selector.empty();
            this.$normalization_selector.append(elements.join(''));
        }

        if ("MapLoad" === event.type) {
            // TODO -- start norm widget "not ready" state
            this.startNotReady();

            updateOptions.call(this);

        } else if ("NormVectorIndexLoad" === event.type) {

            updateOptions.call(this);

            // TODO -- end norm widget "not ready" state
            this.stopNotReady();

        } else if ("NormalizationFileLoad" === event.type) {
            if(event.data === "start") {
                this.startNotReady();
            } else {
                this.stopNotReady();
            }
        }
    };

    return hic;

})
(hic || {});
