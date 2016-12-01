define([ 'exports'],function (exports) {


	function ErrorCorrectionLevel(ordinal, bits, name) {
		this.ordinal_Renamed_Field = ordinal;
		this.bits = bits;
		this.name = name;
		this.__defineGetter__("Bits", function () {
			return this.bits;
		});
		this.__defineGetter__("Name", function () {
			return this.name;
		});
		this.ordinal = function () {
			return this.ordinal_Renamed_Field;
		}
	}

	ErrorCorrectionLevel.forBits = function (bits) {
		if (bits < 0 || bits >= FOR_BITS.length) {
			throw "ArgumentException";
		}
		return FOR_BITS[bits];
	};

	var L = new ErrorCorrectionLevel(0, 0x01, "L");
	var M = new ErrorCorrectionLevel(1, 0x00, "M");
	var Q = new ErrorCorrectionLevel(2, 0x03, "Q");
	var H = new ErrorCorrectionLevel(3, 0x02, "H");
	var FOR_BITS = [M, L, H, Q];

	exports.ErrorCorrectionLevel=ErrorCorrectionLevel;
	exports.FOR_BITS=FOR_BITS;

});