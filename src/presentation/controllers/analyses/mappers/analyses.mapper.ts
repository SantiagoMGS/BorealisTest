import {
  IAnalysisEntity,
  ResultValueXRF,
} from '@domain/entities/analyses/analyses.entity';
import { CreateDHAnalysesDto } from '../dtos/create-dh-analyses.dto';
import { BadRequestException } from '@nestjs/common';
import { CreateLWAnalysesDto } from '../dtos/create-lw-analyses.dto';

interface XRFAnalysisData {
  sampleId: string;
  analysisDate: string;
  resultValue: string;
}

export class AnalysesMapper {
  static toEntityDH(analysis: CreateDHAnalysesDto): IAnalysisEntity {
    return {
      sampleId: analysis.sampleId,
      analysisDate: new Date(analysis.analysisDate),
      resultValue: analysis.resultValue,
    };
  }

  static toEntityXRF(analysis: XRFAnalysisData): IAnalysisEntity {
    try {
      const analysisDate = new Date(analysis.analysisDate);
      if (isNaN(analysisDate.getTime())) {
        throw new BadRequestException('La fecha de análisis no es válida');
      }

      const resultValue = this.parseXRFContent(analysis.resultValue);

      const validatedResults = resultValue.map((result) => {
        if (!result.time || isNaN(result.time.getTime())) {
          result.time = new Date(analysisDate);
        }
        return result;
      });

      return {
        sampleId: analysis.sampleId,
        analysisDate: analysisDate,
        resultValue: validatedResults,
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof BadRequestException
          ? error.message
          : 'Error parsing XRF file content',
      );
    }
  }

  private static parseXRFContent(content: string): ResultValueXRF[] {
    try {
      const normalizedContent = content
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n');
      const lines = normalizedContent.split('\n');

      const headers = lines[0].split('\t').map((h) => h.trim().toLowerCase());

      const results: ResultValueXRF[] = [];
      let validLinesCount = 0;

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) {
          continue;
        }

        const dataLine = lines[i].split('\t');

        validLinesCount++;

        const columnMap: Record<string, string> = {
          'reading no': 'readingNo',
          'reading.no': 'readingNo',
          readingno: 'readingNo',
          time: 'time',
          type: 'type',
          duration: 'duration',
          units: 'units',
          sequence: 'sequence',
          res: 'res',
          escale: 'eScale',
          'shape time': 'shapeTime',
          sample: 'sample',
          location: 'location',
          inspector: 'inspector',
          misc: 'misc',
          note: 'note',
          flags: 'flags',
          mo: 'mo',
          'mo error': 'moError',
          zr: 'zr',
          'zr error': 'zrError',
          sr: 'sr',
          'sr error': 'srError',
        };

        const result: Record<string, string> = {};

        headers.forEach((header, index) => {
          if (dataLine[index]) {
            const mappedName = columnMap[header] || header;
            const value = dataLine[index].trim();

            if (value && value !== '') {
              result[mappedName] = value;
            }
          }
        });

        const mappedResult: Partial<ResultValueXRF> = {
          readingNo:
            result['readingNo'] || result['reading no'] || dataLine[0] || '',
          time: result['time']
            ? new Date(result['time'])
            : new Date(dataLine[1] || Date.now()),
          type: result['type'] || dataLine[2] || '',
          duration: (result['duration'] || dataLine[3] || '').replace(
            /\s+cps$/,
            '',
          ),
          units: result['units'] || dataLine[4] || '',
          sequence: result['sequence'] || dataLine[5] || '',
          res: result['res'] || '',
          eScale: result['eScale'] || '',
          shapeTime: result['shapeTime'] || '',
          sample: result['sample'] || '',
          location: result['location'] || '',
          inspector: result['inspector'] || '',
          misc: result['misc'] || '',
          note: result['note'] || '',
          flags: result['flags'] || '',
          mo: result['mo'] || '',
          moError: result['moError'] || '',
          zr: result['zr'] || '',
          zrError: result['zrError'] || '',
          sr: result['sr'] || '',
          srError: result['srError'] || '',
        };

        const validatedResult = this.validateXRFData(mappedResult);
        results.push(validatedResult);
      }

      return results;
    } catch (error) {
      console.error('Error parsing XRF content:', error);
      throw error;
    }
  }

  private static validateXRFData(
    data: Partial<ResultValueXRF>,
  ): ResultValueXRF {
    const requiredFields = [
      'readingNo',
      'time',
      'type',
      'duration',
      'units',
      'sequence',
    ] as const;

    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      throw new BadRequestException(
        `Missing required fields in XRF file: ${missingFields.join(', ')}`,
      );
    }

    const baseResult: ResultValueXRF = {
      readingNo: data.readingNo!,
      time: data.time instanceof Date ? data.time : new Date(data.time!),
      type: data.type!,
      duration: data.duration!,
      units: data.units!,
      sequence: data.sequence!,
      res: data.res || '',
      eScale: data.eScale || '',
      shapeTime: data.shapeTime || '',
      sample: data.sample || '',
      location: data.location || '',
      inspector: data.inspector || '',
      misc: data.misc || '',
      note: data.note || '',
      flags: data.flags || '',
      mo: data.mo || '',
      moError: data.moError || '',
      zr: data.zr || '',
      zrError: data.zrError || '',
      sr: data.sr || '',
      srError: data.srError || '',
      u: data.u || '',
      uError: data.uError || '',
      rb: data.rb || '',
      rbError: data.rbError || '',
      th: data.th || '',
      thError: data.thError || '',
      pb: data.pb || '',
      pbError: data.pbError || '',
      au: data.au || '',
      auError: data.auError || '',
      se: data.se || '',
      seError: data.seError || '',
      as: data.as || '',
      asError: data.asError || '',
      hg: data.hg || '',
      hgError: data.hgError || '',
      zn: data.zn || '',
      znError: data.znError || '',
      w: data.w || '',
      wError: data.wError || '',
      cu: data.cu || '',
      cuError: data.cuError || '',
      ni: data.ni || '',
      niError: data.niError || '',
      co: data.co || '',
      coError: data.coError || '',
      fe: data.fe || '',
      feError: data.feError || '',
      mn: data.mn || '',
      mnError: data.mnError || '',
      sb: data.sb || '',
      sbError: data.sbError || '',
      sn: data.sn || '',
      snError: data.snError || '',
      cd: data.cd || '',
      cdError: data.cdError || '',
      pd: data.pd || '',
      pdError: data.pdError || '',
      ag: data.ag || '',
      agError: data.agError || '',
      bal: data.bal || '',
      balError: data.balError || '',
      nb: data.nb || '',
      nbError: data.nbError || '',
      bi: data.bi || '',
      biError: data.biError || '',
      re: data.re || '',
      reError: data.reError || '',
      ta: data.ta || '',
      taError: data.taError || '',
      hf: data.hf || '',
      hfError: data.hfError || '',
      cr: data.cr || '',
      crError: data.crError || '',
      v: data.v || '',
      vError: data.vError || '',
      ti: data.ti || '',
      tiError: data.tiError || '',
      sc: data.sc || '',
      scError: data.scError || '',
      ca: data.ca || '',
      caError: data.caError || '',
      k: data.k || '',
      kError: data.kError || '',
      s: data.s || '',
      sError: data.sError || '',
      ba: data.ba || '',
      baError: data.baError || '',
      te: data.te || '',
      teError: data.teError || '',
      al: data.al || '',
      alError: data.alError || '',
      p: data.p || '',
      pError: data.pError || '',
      si: data.si || '',
      siError: data.siError || '',
      cl: data.cl || '',
      clError: data.clError || '',
      mg: data.mg || '',
      mgError: data.mgError || '',
    };

    return baseResult;
  }

  static toEntityLW(analysis: CreateLWAnalysesDto): IAnalysisEntity {
    return {
      sampleId: analysis.sampleId,
      analysisDate: new Date(analysis.analysisDate),
      resultValue: analysis.resultValue,
    };
  }
}
