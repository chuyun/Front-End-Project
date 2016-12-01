/**
 * Created by jun on 2016/11/13.
 */

define(['gf256','datablock','exports','rsdecoder'],function (gf256, datablock, exports,rsdecoder) {


    var Decoder={};

    Decoder.rsDecoder = new rsdecoder.ReedSolomonDecoder(gf256.GF256.QR_CODE_FIELD);

    Decoder.correctErrors=function( codewordBytes,  numDataCodewords)
    {
        var numCodewords = codewordBytes.length;
        // First read into an array of ints
        var codewordsInts = new Array(numCodewords);
        for (var i = 0; i < numCodewords; i++)
        {
            codewordsInts[i] = codewordBytes[i] & 0xFF;
        }
        var numECCodewords = codewordBytes.length - numDataCodewords;
        try
        {
            Decoder.rsDecoder.decode(codewordsInts, numECCodewords);
            //var corrector = new ReedSolomon(codewordsInts, numECCodewords);
            //corrector.correct();
        }
        catch ( rse)
        {
            throw rse;
        }
        // Copy back into array of bytes -- only need to worry about the bytes that were data
        // We don't care about errors in the error-correction codewords
        for (var i = 0; i < numDataCodewords; i++)
        {
            codewordBytes[i] =  codewordsInts[i];
        }
    };

    Decoder.decode=function(bits)
    {
        var parser = new BitMatrixParser(bits);
        var version = parser.readVersion();
        var ecLevel = parser.readFormatInformation().ErrorCorrectionLevel;

        // Read codewords
        var codewords = parser.readCodewords();

        
        // Separate into data blocks
        var dataBlocks = datablock.DataBlock.getDataBlocks(codewords, version, ecLevel);

        // Count total number of data bytes
        var totalBytes = 0;
        for (var i = 0; i < dataBlocks.length; i++)
        {
            totalBytes += dataBlocks[i].NumDataCodewords;
        }
        var resultBytes = new Array(totalBytes);
        var resultOffset = 0;

        // Error-correct and copy data blocks together into a stream of bytes
        for (var j = 0; j < dataBlocks.length; j++)
        {
            var dataBlock = dataBlocks[j];
            var codewordBytes = dataBlock.Codewords;
            var numDataCodewords = dataBlock.NumDataCodewords;
            Decoder.correctErrors(codewordBytes, numDataCodewords);
            for (var i = 0; i < numDataCodewords; i++)
            {
                resultBytes[resultOffset++] = codewordBytes[i];
            }
        }

        // Decode the contents of that stream of bytes
        var reader = new QRCodeDataBlockReader(resultBytes, version.VersionNumber, ecLevel.Bits);
        return reader;
        //return DecodedBitStreamParser.decode(resultBytes, version, ecLevel);
    };



exports.Decoder=Decoder;


});
