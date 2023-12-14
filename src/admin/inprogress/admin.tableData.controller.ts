import { Controller, Post, Res, Body, HttpStatus } from '@nestjs/common';
import { TableService } from './admin.tableData.service';



@Controller('record')
export class TableController {
    constructor(private tableService: TableService) { }

    @Post()
    addNewRecord(@Res() res, @Body() data: String) {
        this.tableService.add(data);
        res.status(HttpStatus.OK).send('Pushed');
    }

}