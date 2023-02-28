<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Menu;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use App\Models\MyCourse;
use App\Models\Transaction;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class DashboardController extends Controller {
    public function menu() {
        if (request()->wantsJson()) {
            $menus = Menu::with(['children' => function ($q) {
                $q->where('shown', true);
            }])->where('parent_id', 0)->where(function ($q) {
                $q->where('route', 'LIKE', '%' . request()->user()->role . '%');
                $q->orWhere('middleware', 'LIKE', '%' . request()->user()->role . '%');
            })->where('shown', 1)->get();

            return response()->json($menus);
        } else {
            return abort(404);
        }
    }

    public function index(Request $request) {
        if (request()->wantsJson() && request()->ajax()) {
            $startDate = null;

            $year = $request->year ?? date('Y');
            $month = $request->month ?? date('m');
            $startDate = Carbon::parse("$year-$month-01")->format('Y-m-d H:i:s');
            $endDate = Carbon::parse("$year-$month-01")->endOfMonth()->format('Y-m-d H:i:s');

            $period = collect(CarbonPeriod::create($startDate, $endDate));

            $chart = [];
            $chart['timestamps'] = $period->map(function ($date) {
                return (int) round(intval($date->format('Uu')) / pow(10, 3));
            });
            $chart['data'] = $period->map(function ($date) use ($request) {
                return [
                    'courses' => MyCourse::whereDate('created_at', $date)->count(),
                    'profit' => Transaction::whereDate('created_at', $date)->sum('amount'),
                ];
            });

            $chart['courses'] = collect($chart['data'])->map(function ($data) {
                return $data['courses'];
            });
            $chart['profit'] = collect($chart['data'])->map(function ($data) {
                return $data['profit'];
            });
            unset($chart['data']);

            return response()->json($chart);
        } else {
            abort(404);
        }
    }

    public function laporan(Request $request) {
        if (request()->wantsJson() && request()->ajax()) {
            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();

            $months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
            $month = $months[(int)$request->month - 1];

            $courses = MyCourse::whereMonth('created_at', $request->month)->whereYear('created_at', date('Y'))->get();

            $sheet->setCellValue('A1', 'Laporan Penjualan Bulan ' . $month . ' Tahun ' . date('Y'));
            $sheet->mergeCells('A1:F1');

            $sheet->setCellValue('A2', 'No');
            $sheet->setCellValue('B2', 'Tanggal');
            $sheet->setCellValue('C2', 'Nama');
            $sheet->setCellValue('D2', 'Email');
            $sheet->setCellValue('E2', 'Kelas');
            $sheet->setCellValue('F2', 'Harga');

            $sheet->getStyle('A1:F1')->getFont()->setBold(true);
            $sheet->getStyle('A2:F2')->getFont()->setBold(true);

            $row = 3;
            $total = 0;
            foreach ($courses as $course) {
                $sheet->setCellValue('A' . $row, $row - 2);
                $sheet->setCellValue('B' . $row, $course->transaction->date);
                $sheet->setCellValue('C' . $row, $course->transaction->user->name);
                $sheet->setCellValue('D' . $row, $course->transaction->user->email);
                $sheet->setCellValue('E' . $row, $course->course->name);
                $sheet->setCellValue('F' . $row, currency($course->course->price, true));

                $total += $course->course->price;
                $row++;
            }

            $sheet->setCellValue('A' . $row, 'Total');
            $sheet->mergeCells('A' . $row . ':D' . $row);
            $sheet->setCellValue('F' . $row, currency($total, true));
            $sheet->getStyle('F' . $row)->getFont()->setBold(true);

            $sheet->getColumnDimension('A')->setWidth(5);
            $sheet->getColumnDimension('B')->setWidth(20);
            $sheet->getColumnDimension('C')->setWidth(30);
            $sheet->getColumnDimension('D')->setWidth(30);
            $sheet->getColumnDimension('E')->setWidth(20);
            $sheet->getColumnDimension('F')->setWidth(20);

            $sheet->getStyle('A1:F' . $row)->getAlignment()->setVertical('center');
            $sheet->getStyle('A1:A' . $row)->getAlignment()->setHorizontal('center');
            $sheet->getStyle('B1:B' . $row)->getAlignment()->setHorizontal('center');

            $sheet->getStyle('A1:F' . $row)->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);

            $sheet->getStyle('A1:F' . $row)->getAlignment()->setWrapText(true);

            $writer = new Xlsx($spreadsheet);
            $filename = 'Laporan Penjualan Bulan ' . $month . ' Tahun ' . date('Y') . '.xlsx';
            header('Content-Type: application/vnd.ms-excel');
            header('Content-Disposition: attachment; filename="' . $filename . '"');
            $writer->save("php://output");
        } else {
            return abort(404);
        }
    }
}
