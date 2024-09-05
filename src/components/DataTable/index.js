import React from 'react'
import {Button,FormControl,InputLabel,OutlinedInput,InputAdornment
    ,Table,TableHead,TableCell,TableRow,TableBody} from '@material-ui/core'
import Skeleton from 'components/Skeleton'
import { TablePagination } from '@trendmicro/react-paginations';
import CevronRight from 'assets/icon/chevron-right.svg'
import CevronLeft from 'assets/icon/chevron-left.svg'
import SearchImg from 'assets/icon/Search.png'
import SearchTable from 'components/SearchTable'
export default function DataTable(props) {
    let {head,body,cardHead,loading,pagination,togglePagination}=props
    return (
        <div className='card-content'>
            <div className='card-table'>
                <div className='card-table___head'>
                {cardHead}

                </div>
                <br/>
                <div className='card-table__content'>
                <Table  size="small" aria-label="a dense table">
                        <TableHead>
                        <TableRow>
                            {head.map((d,i)=>(
                                <TableCell align={i!==head.length-1?'left':'right'}>{d}</TableCell>
                            ))}
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading?<Skeleton count={head.length}/>:body()}
                        </TableBody>
                    </Table>
                    <div className='card-table__pagination'>
                    {pagination!==null&&
                    <TablePagination
                            className="card-pagination"
                            type="reduced"
                            page={pagination.page}
                            pageLength={pagination.perPage}
                            totalRecords={pagination.total}
                            totalRecords={pagination.total}
                            onPageChange={({ page, pageLength }) => {
                                togglePagination(page,pageLength)
                            }}
                            prevPageRenderer={() => <img src={CevronLeft} style={{width:10}}/>}
                            nextPageRenderer={() => <img src={CevronRight}/>}
                        />
                    }
                </div>
                </div>
            </div>
        </div>
    )
}
