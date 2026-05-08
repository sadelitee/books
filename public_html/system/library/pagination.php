<?php

/**
 * Pagination class
 */
class Pagination
{
	public $total = 0;
	public $page = 1;
	public $limit = 20;
	public $num_links = 6;
	public $url = '';

	public $text_next = 'Вперед';
	public $text_prev = 'Назад';

	public function render()
	{
		$total = $this->total;

		$page = (int)$this->page < 1 ? 1 : (int)$this->page;
		$limit = (int)$this->limit ? (int)$this->limit : 10;
		$num_links = (int)$this->num_links ? (int)$this->num_links : 8;

		$num_pages = (int)ceil($total / $limit);

		if ($num_pages <= 1) {
			return '';
		}

		$this->url = str_replace('%7Bpage%7D', '{page}', $this->url);

		$output = '<div class="pagination">';

		// Назад
		if ($page > 1) {
			$prev_url = $page - 1 === 1
				? $this->getFirstPageUrl()
				: str_replace('{page}', $page - 1, $this->url);

			$output .= '<a class="pagination-prev" href="' . $prev_url . '"><svg viewbox="0 0 24 24" width="12" height="20"><use href="/assets/icons/sprite.svg#icon-chevron-left"></use></svg>' . '<p class="hidden sm:block">' . $this->text_prev . '</p></a>';
		} else {
			$output .= '<span class="pagination-prev" disabled><svg viewbox="0 0 24 24" width="12" height="20"><use href="/assets/icons/sprite.svg#icon-chevron-left"><p class="hidden sm:block">' . $this->text_prev . '</p></span>';
		}

		// Страницы
		if ($num_pages <= $num_links + 1) {
			for ($i = 1; $i <= $num_pages; $i++) {
				$output .= $this->getPageItem($i, $page);
			}
		} else {
			if ($page <= $num_links) {
				for ($i = 1; $i <= $num_links; $i++) {
					$output .= $this->getPageItem($i, $page);
				}

				$dots_page = $num_links + 1;

				$output .= $this->getDotsItem($dots_page);
				$output .= $this->getPageItem($num_pages, $page);
			} elseif ($page > $num_pages - $num_links + 1) {
				$output .= $this->getPageItem(1, $page);

				$dots_page = $num_pages - $num_links;

				$output .= $this->getDotsItem($dots_page);

				for ($i = $num_pages - $num_links + 1; $i <= $num_pages; $i++) {
					$output .= $this->getPageItem($i, $page);
				}
			} else {
				$output .= $this->getPageItem(1, $page);

				$start = $page - floor($num_links / 2);
				$end = $page + floor($num_links / 2);

				$prev_dots_page = $start - 1;
				$next_dots_page = $end + 1;

				$output .= $this->getDotsItem($prev_dots_page);

				for ($i = $start; $i <= $end; $i++) {
					$output .= $this->getPageItem($i, $page);
				}

				$output .= $this->getDotsItem($next_dots_page);
				$output .= $this->getPageItem($num_pages, $page);
			}
		}

		// Вперед
		if ($page < $num_pages) {
			$output .= '<a class="pagination-next" href="' . str_replace('{page}', $page + 1, $this->url) . '"><p class="hidden sm:block">' . $this->text_next . '</p><svg viewbox="0 0 24 24" width="12" height="20"><use href="/assets/icons/sprite.svg#icon-chevron-right"></use></svg></a>';
		} else {
			$output .= '<span class="pagination-next" disabled><p class="hidden sm:block">' . $this->text_next . '</p><svg viewbox="0 0 24 24" width="12" height="20"><use href="/assets/icons/sprite.svg#icon-chevron-right"></use></svg></span>';
		}

		$output .= '</ul>';

		return $output;
	}

	private function getPageItem($i, $page)
	{
		if ((int)$i === (int)$page) {
			return '<div class="pagination-item" active><span>' . $i . '</span></div>';
		}

		$url = $i === 1
			? $this->getFirstPageUrl()
			: str_replace('{page}', $i, $this->url);

		return '<a class="pagination-item" href="' . $url . '">' . $i . '</a>';
	}

	private function getDotsItem($page)
	{
		$page = (int)$page;

		if ($page <= 1) {
			$url = $this->getFirstPageUrl();
		} else {
			$url = str_replace('{page}', $page, $this->url);
		}

		return '<a class="pagination-item" href="' . $url . '">...</a>';
	}

	private function getFirstPageUrl()
	{
		return str_replace(
			array('&amp;page={page}', '?page={page}', '&page={page}'),
			'',
			$this->url
		);
	}
}
