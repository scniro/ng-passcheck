function init() {
	var table = '00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D';
	var table = table.split(' ').map(function (s) { return parseInt(s, 16) });

	String.prototype.crc32 = function () {
		var crc = crc ^ (-1);
		for (var i = 0, iTop = this.length; i < iTop; i += 1) {
			crc = (crc >>> 8) ^ table[(crc ^ this.charCodeAt(i)) & 0xFF];
		}
		return (crc ^ (-1)) >>> 0;
	}

	angular.module('ngPasscheck', [])
	.directive('passCheck', ['passCheckService', function (passCheckService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: {
				password: '=ngModel',
				passCheck: '@'
			},
			link: function (scope, elem, attrs) {
				scope.$on('passCheckService:init', function () {

					scope.$watch('password', function (n) {

						var result = n ? passCheckService.analyze(n) : null;
						scope.$emit(scope.passCheck + ':result', result);
					});
				});
			}
		}
	}])
	.provider('passCheck', [function () {
		return {
			init: function (options) {

				this.scoring = {
					base: options.scoring && options.scoring.base ? options.scoring.base : null,
					medium: {
						min: options.scoring && options.scoring.medium && options.scoring.medium.min ? options.scoring.medium.min && options.scoring.medium.min : null,
						max: options.scoring && options.scoring.medium && options.scoring.medium.max ? options.scoring.medium.max && options.scoring.medium.max : null,
						bonus: options.scoring && options.scoring.medium && options.scoring.medium.bonus ? options.scoring.medium.max && options.scoring.medium.bonus : null
					},
					strong: {
						min: options.scoring && options.scoring.strong && options.scoring.strong.min ? options.scoring.strong.min && options.scoring.strong.min : null,
						max: options.scoring && options.scoring.strong && options.scoring.strong.max ? options.scoring.strong.max && options.scoring.strong.max : null,
						bonus: options.scoring && options.scoring.strong && options.scoring.strong.bonus ? options.scoring.strong.max && options.scoring.strong.bonus : null
					}
				}

				this.policies = {
					medium: {
						pattern: options.policies && options.policies.medium && options.policies.medium.pattern ? options.policies.medium.pattern : null,
						minimum: options.policies && options.policies.medium && options.policies.medium.minimum ? options.policies.medium.minimum : null
					},
					strong: {
						pattern: options.policies && options.policies.strong && options.policies.strong.pattern ? options.policies.strong.pattern : null,
						minimum: options.policies && options.policies.strong && options.policies.strong.minimum ? options.policies.strong.minimum : null
					}
				}

				this.testCommon = options.testCommon ? { 'path': options.testCommon.path, 'limit': options.testCommon.limit } : null;
			},
			$get: function () {
				return {
					policies: {
						medium: {
							pattern: this.policies.medium.pattern ? this.policies.medium.pattern : '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])',
							minimum: this.policies.medium.minimum ? this.policies.medium.minimum : 8
						},
						strong: {
							pattern: this.policies.strong.pattern ? this.policies.strong.pattern : '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\\w\\s])',
							minimum: this.policies.strong.minimum ? this.policies.strong.minimum : 12
						}
					},
					scoring: {
						base: this.scoring.base ? this.scoring.base : 1,
						medium: {
							min: this.scoring.medium.min ? this.scoring.medium.min : 40,
							max: this.scoring.medium.max ? this.scoring.medium.max : 65,
							bonus: this.scoring.medium.bonus ? this.scoring.medium.bonus : 1.25
						},
						strong: {
							min: this.scoring.strong.min ? this.scoring.strong.min : 65,
							max: this.scoring.strong.max ? this.scoring.strong.max : 100,
							bonus: this.scoring.strong.bonus ? this.scoring.strong.bonus : 1.50
						}
					},
					testCommon: this.testCommon || false
				}
			}
		}
	}])
	.factory('passCheckService', ['passCheck', '$http', '$rootScope', '$timeout', function (passCheck, $http, $rootScope, $timeout) {

		var dictionary, passFormat;

		function appendTransform(defaults, transform) {
			defaults = angular.isArray(defaults) ? defaults : [defaults];
			return defaults.concat(transform);
		}

		function getNumericStrength(value, ruleSatisfication) {

			var special = {
				'specialCharacters': { 'count': /[^\w\s]/.test(value) ? value.match(/[^\w\s]/g).length : 0 },
				'capitalCharacters': { 'count': /[A-Z]/.test(value) ? value.match(/[A-Z]/g).length : 0 },
				'numericCharacters': { 'count': /\d+/.test(value) ? value.match(/\d/g).length : 0 }
			}

			var bonus = 0;

			var n = value.length;

			var maximum = ruleSatisfication === 0 ?
				passCheck.scoring.medium.min : ruleSatisfication === 1 ?
				passCheck.scoring.medium.max : passCheck.scoring.strong.max;

			var minimum = ruleSatisfication === 2 ?
				passCheck.scoring.strong.min : ruleSatisfication === 1 ?
				passCheck.scoring.medium.min : 0;

			if (ruleSatisfication === 0) {
				n = (value.length * passCheck.scoring.base);
			}

			if (ruleSatisfication === 1) {
				n = minimum + (value.length * passCheck.scoring.base);

				if (value.length > passCheck.policies.medium.minimum) {
					bonus += special.numericCharacters.count * passCheck.scoring.medium.bonus;
					bonus += special.specialCharacters.count * passCheck.scoring.medium.bonus;
					bonus += special.capitalCharacters.count * passCheck.scoring.medium.bonus;
				}

				n += bonus;
			}

			if (ruleSatisfication === 2) {
				n = minimum + ((value.length * passCheck.scoring.base) - passCheck.policies.strong.minimum);

				if (value.length > passCheck.policies.strong.minimum) {
					bonus += special.numericCharacters.count * passCheck.scoring.strong.bonus;
					bonus += special.specialCharacters.count * passCheck.scoring.strong.bonus;
					bonus += special.capitalCharacters.count * passCheck.scoring.strong.bonus;
				}

				n += bonus;
			}

			n = n < minimum ? minimum : n > maximum ? maximum : n;

			return n;
		}

		function analyze(value) {

			var result = {
				'weak': false,
				'medium': false,
				'strong': false,
				'score': 0
			};

			var ruleSatisfication = 0;

			var isCommon = passCheck.testCommon ? dictionary.indexOf(passFormat === 'crc32' ? value.crc32() : value) > -1 ? true : false : false;

			if (!isCommon) {
				if (new RegExp(passCheck.policies.strong.pattern + '.{' + passCheck.policies.strong.minimum + ',}$').test(value)) {
					result.strong = true;
					ruleSatisfication = 2;
				} else if (new RegExp(passCheck.policies.medium.pattern + '.{' + passCheck.policies.medium.minimum + ',}$').test(value)) {
					result.medium = true;
					ruleSatisfication = 1;
				} else {
					result.weak = true;
				}

				result.score = getNumericStrength(value, ruleSatisfication);
			} else {
				result.score = 0;
				result.weak = true;
				result.isCommon = true;
			}

			return result;
		}

		function init(data) {
			dictionary = data;
			$timeout(function () {
				$rootScope.$broadcast('passCheckService:init');
			});
		}

		if (passCheck.testCommon) {
			$http.get(passCheck.testCommon.path, {
				transformResponse: appendTransform($http.defaults.transformResponse, function (data) {
					passFormat = data.format;
					return data.dictionary.slice(0, passCheck.testCommon.limit || data.dictionary.length);
				})
			}).then(function (response) {
				init(response.data);
			});
		} else {
			init();
		}

		return {
			'analyze': analyze
		}
	}]);
}

(function () {
	if (typeof define === 'function' && define.amd) { // RequireJS aware
		define(['angular'], function () {
			init();
		});
	} else {
		init();
	}
}());