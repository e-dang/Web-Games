import pytest

from .pages.sudoku_page import SudokuPage


@pytest.mark.usefixtures('driver_init')
class TestSudokuGame:
    @pytest.fixture(autouse=True)
    def url(self):
        return 'http://localhost:5000/sudoku'

    def solve_board(self, page):
        solver = SudokuSolver()

        board = page.get_board_as_array()
        given_indices = []
        for i in range(len(board)):
            for j in range(len(board[0])):
                if board[i][j] != '':
                    given_indices.append((i, j))

        solver.solve(board)
        for i in range(len(board)):
            for j in range(len(board[0])):
                if (i, j) not in given_indices:
                    page.enter_number(i, j, board[i][j])

    def test_user_is_presented_with_correct_controls_and_options(self, url):
        # The user goes to the page
        self.driver.get(url)
        page = SudokuPage(self.driver)

        # the user sees the correct page title
        assert page.has_correct_title()

        # they then see a navigation bar with a header specifying the current game and a dropdown menu to select
        # different games
        assert page.has_navigation_bar()
        assert page.has_correct_header()
        assert page.can_select_games()

        # they also notice that there is a board and 2 buttons, one that allows them to reset the game, and one to get a hint
        assert page.has_board()
        assert page.board_cells_are_square()
        assert page.board_cells_contain_numbers()
        assert page.can_click_reset()
        assert page.can_click_hint()

        # The user also sees a dropdown menu to select the difficulty, which they then click through
        page.change_difficulty('easy')
        assert page.get_current_difficulty() == 'Easy'
        page.change_difficulty('moderate')
        assert page.get_current_difficulty() == 'Moderate'
        page.change_difficulty('hard')
        assert page.get_current_difficulty() == 'Hard'
        page.change_difficulty('veryHard')
        assert page.get_current_difficulty() == 'Very Hard'

    def test_user_can_enter_valid_but_not_invalid_inputs_into_board_cells(self, url):
        # The user goes to the page
        self.driver.get(url)
        page = SudokuPage(self.driver)

        # the user selects an empty cell and enters a letter, but doesnt see it appear in the cell
        row, col = page.get_empty_node()
        page.enter_number(row, col, 'a')
        assert page.get_node_input_value(row, col) == ''

        # the user then tries to input 0 and again does not see it appear in the cell
        page.enter_number(row, col, 0)
        assert page.get_node_input_value(row, col) == ''

        # the user now tries to input 1 - 9 and sees that they all appear in the cell
        for i in range(1, 10):
            page.enter_number(row, col, i)
            assert page.get_node_input_value(row, col) == str(i)

        # the user then tries to enter a double digit number, but only sees the first digit of that number appear
        page.enter_number(row, col, 12)
        assert page.get_node_input_value(row, col) == '1'

    def test_user_can_solve_sudoku(self, url):
        # The user goes to the page
        self.driver.get(url)
        page = SudokuPage(self.driver)

        # the user is a genius and solves the puzzle extremely quickly
        self.solve_board(page)

        assert page.game_is_over()

    def test_user_can_get_a_hint_and_reset_in_middle_of_game(self, url):
        # The user goes to the page
        self.driver.get(url)
        page = SudokuPage(self.driver)

        # the user immediately asks for a hint and sees a number appear in an empty node
        board_i = page.get_board_as_array()
        page.click_get_hint()
        board_f = page.get_board_as_array()
        num_different = 0
        for r_i, r_f in zip(board_i, board_f):
            for c_i, c_f in zip(r_i, r_f):
                if c_i != c_f:
                    num_different += 1
        assert num_different == 1

        # the user doesnt like the board they were given and chooses to reset it
        page.click_reset()
        board = page.get_board_as_array()
        assert board_f != board
        assert page.board_cells_are_square()
        assert page.board_cells_contain_numbers()

        # the user then decides to only use hints to solve the board
        num_blanks = 0
        for r in board:
            for c in r:
                if c == '':
                    num_blanks += 1

        for _ in range(num_blanks):
            page.click_get_hint()

        assert page.game_is_over()

        # the user then clears the modal, resets the board, and solves the board manually
        page.clear_modal()
        page.click_reset()
        self.solve_board(page)
        assert page.game_is_over()

    def test_invalid_nodes_get_error_highlighted(self, url):
        # The user goes to the page
        self.driver.get(f'{url}/1')  # url parameter is rng seed
        page = SudokuPage(self.driver)

        # the user enters an invalid value into a node
        row, col_1, value = 0, 1, '6'
        box_idx_1 = get_box_idx(row, col_1)
        page.enter_number(row, col_1, value)

        # The user then sees that error borders and background appear around the nodes with the same value and in the
        # same row, col, box
        board = page.get_board_as_array()
        for r in range(len(board)):
            for c in range(len(board[0])):
                same_row = r == row
                same_col = c == col_1
                same_box = box_idx_1 == get_box_idx(r, c)
                num_errors = sum([same_row, same_col, same_box])

                if (same_row or same_col or same_box) and board[r][c] == value:
                    assert page.node_has_error_border(r, c)

                for i in range(1, num_errors + 1):
                    assert page.node_has_error_section_background(r, c, i)

        # The user then clears the selection and sees the error borders removed
        page.enter_number(row, col_1, '')
        for r in range(len(board)):
            for c in range(len(board[0])):
                assert not page.node_has_error_border(r, c)
                for i in range(1, 4):
                    assert not page.node_has_error_section_background(r, c, i)

        # the user then tries to see if the error signals stack on top of each other by entering two invalid values
        col_2 = 3
        box_idx_2 = get_box_idx(row, col_2)
        page.enter_number(row, col_1, value)
        page.enter_number(row, col_2, value)
        for r in range(len(board)):
            for c in range(len(board[0])):
                same_row = r == row
                same_col_1 = c == col_1
                same_box_1 = box_idx_1 == get_box_idx(r, c)
                same_col_2 = c == col_2
                same_box_2 = box_idx_2 == get_box_idx(r, c)
                num_errors = sum([same_row, same_col_1, same_col_2, same_box_1, same_box_2])

                if (same_row or same_col_1 or same_box_1 or same_col_2 or same_box_2) and board[r][c] == value:
                    assert page.node_has_error_border(r, c)

                for i in range(1, min(num_errors + 1, 4)):
                    assert page.node_has_error_section_background(r, c, i)

        # The user then clears the selection and sees the error borders removed
        page.enter_number(row, col_1, '')
        page.enter_number(row, col_2, '')
        for r in range(len(board)):
            for c in range(len(board[0])):
                assert not page.node_has_error_border(r, c)
                for i in range(1, 4):
                    assert not page.node_has_error_section_background(r, c, i)


class SudokuSolver:
    def solve(self, board):
        row_bit_map, col_bit_map, box_bit_map, remaining_count = self.get_bit_maps(board)
        self.solve_helper(0, 0, remaining_count, row_bit_map, col_bit_map, box_bit_map, board)

    def get_bit_maps(self, board):
        row_bit_map = [-1 for _ in range(len(board))]
        col_bit_map = [-1 for _ in range(len(board[0]))]
        box_bit_map = [-1 for _ in range(len(board))]
        remaining_count = 0

        for row in range(len(board)):
            for col in range(len(board[row])):
                if board[row][col] == '':
                    remaining_count += 1
                    continue

                box_idx = get_box_idx(row, col)
                row_bit_map[row] = self.clear_bit(row_bit_map[row], int(board[row][col]) - 1)
                col_bit_map[col] = self.clear_bit(col_bit_map[col], int(board[row][col]) - 1)
                box_bit_map[box_idx] = self.clear_bit(box_bit_map[box_idx], int(board[row][col]) - 1)

        return row_bit_map, col_bit_map, box_bit_map, remaining_count

    def solve_helper(self, row, col, remaining_count, row_bit_map, col_bit_map, box_bit_map, board):
        if remaining_count == 0:
            return True

        next_row, next_col = self.get_next_idx(row, col, len(board))
        if board[row][col] != '':
            return self.solve_helper(next_row, next_col, remaining_count, row_bit_map, col_bit_map, box_bit_map, board)

        box_idx = get_box_idx(row, col)
        prev_row_bit_map = row_bit_map[row]
        prev_col_bit_map = col_bit_map[col]
        prev_box_bit_map = box_bit_map[box_idx]
        for i in range(9):
            if self.get_bit(row_bit_map[row], i) and self.get_bit(col_bit_map[col], i) and self.get_bit(box_bit_map[box_idx], i):
                board[row][col] = str(i + 1)
                row_bit_map[row] = self.clear_bit(row_bit_map[row], i)
                col_bit_map[col] = self.clear_bit(col_bit_map[col], i)
                box_bit_map[box_idx] = self.clear_bit(box_bit_map[box_idx], i)

                if self.solve_helper(next_row, next_col, remaining_count - 1, row_bit_map, col_bit_map, box_bit_map, board):
                    return True

                row_bit_map[row] = prev_row_bit_map
                col_bit_map[col] = prev_col_bit_map
                box_bit_map[box_idx] = prev_box_bit_map

        board[row][col] = ''
        return False

    def get_next_idx(self, row, col, num_cols):
        next_col = (col + 1) % num_cols
        if next_col == 0:
            return row + 1, next_col
        return row, next_col

    def get_bit(self, bit_map, pos):
        return bit_map & (1 << pos)

    def clear_bit(self, bit_map, pos):
        return bit_map & ~(1 << pos)


def get_box_idx(row, col):
    return (row // 3) * 3 + (col // 3)
